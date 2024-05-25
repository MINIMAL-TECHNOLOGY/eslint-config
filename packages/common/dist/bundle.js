'use strict';

var love = require('eslint-config-love');
var require$$0$2 = require('eslint-config-prettier');
var require$$0$1 = require('node:crypto');
var require$$1$1 = require('node:fs');
var require$$0 = require('node:module');
var require$$2 = require('node:path');
var require$$4 = require('node:url');
var require$$5 = require('node:worker_threads');

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

/**
 * This library modifies the diff-patch-match library by Neil Fraser
 * by removing the patch and match functionality and certain advanced
 * options in the diff function. The original license is as follows:
 *
 * ===
 *
 * Diff Match and Patch
 *
 * Copyright 2006 Google Inc.
 * http://code.google.com/p/google-diff-match-patch/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * The data structure representing a diff is an array of tuples:
 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
 */
var DIFF_DELETE = -1;
var DIFF_INSERT = 1;
var DIFF_EQUAL = 0;

/**
 * Find the differences between two texts.  Simplifies the problem by stripping
 * any common prefix or suffix off the texts before diffing.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {Int|Object} [cursor_pos] Edit position in text1 or object with more info
 * @param {boolean} [cleanup] Apply semantic cleanup before returning.
 * @return {Array} Array of diff tuples.
 */
function diff_main(text1, text2, cursor_pos, cleanup, _fix_unicode) {
  // Check for equality
  if (text1 === text2) {
    if (text1) {
      return [[DIFF_EQUAL, text1]];
    }
    return [];
  }

  if (cursor_pos != null) {
    var editdiff = find_cursor_edit_diff(text1, text2, cursor_pos);
    if (editdiff) {
      return editdiff;
    }
  }

  // Trim off common prefix (speedup).
  var commonlength = diff_commonPrefix(text1, text2);
  var commonprefix = text1.substring(0, commonlength);
  text1 = text1.substring(commonlength);
  text2 = text2.substring(commonlength);

  // Trim off common suffix (speedup).
  commonlength = diff_commonSuffix(text1, text2);
  var commonsuffix = text1.substring(text1.length - commonlength);
  text1 = text1.substring(0, text1.length - commonlength);
  text2 = text2.substring(0, text2.length - commonlength);

  // Compute the diff on the middle block.
  var diffs = diff_compute_(text1, text2);

  // Restore the prefix and suffix.
  if (commonprefix) {
    diffs.unshift([DIFF_EQUAL, commonprefix]);
  }
  if (commonsuffix) {
    diffs.push([DIFF_EQUAL, commonsuffix]);
  }
  diff_cleanupMerge(diffs, _fix_unicode);
  if (cleanup) {
    diff_cleanupSemantic(diffs);
  }
  return diffs;
}

/**
 * Find the differences between two texts.  Assumes that the texts do not
 * have any common prefix or suffix.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 */
function diff_compute_(text1, text2) {
  var diffs;

  if (!text1) {
    // Just add some text (speedup).
    return [[DIFF_INSERT, text2]];
  }

  if (!text2) {
    // Just delete some text (speedup).
    return [[DIFF_DELETE, text1]];
  }

  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  var i = longtext.indexOf(shorttext);
  if (i !== -1) {
    // Shorter text is inside the longer text (speedup).
    diffs = [
      [DIFF_INSERT, longtext.substring(0, i)],
      [DIFF_EQUAL, shorttext],
      [DIFF_INSERT, longtext.substring(i + shorttext.length)],
    ];
    // Swap insertions for deletions if diff is reversed.
    if (text1.length > text2.length) {
      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
    }
    return diffs;
  }

  if (shorttext.length === 1) {
    // Single character string.
    // After the previous speedup, the character can't be an equality.
    return [
      [DIFF_DELETE, text1],
      [DIFF_INSERT, text2],
    ];
  }

  // Check to see if the problem can be split in two.
  var hm = diff_halfMatch_(text1, text2);
  if (hm) {
    // A half-match was found, sort out the return data.
    var text1_a = hm[0];
    var text1_b = hm[1];
    var text2_a = hm[2];
    var text2_b = hm[3];
    var mid_common = hm[4];
    // Send both pairs off for separate processing.
    var diffs_a = diff_main(text1_a, text2_a);
    var diffs_b = diff_main(text1_b, text2_b);
    // Merge the results.
    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
  }

  return diff_bisect_(text1, text2);
}

/**
 * Find the 'middle snake' of a diff, split the problem in two
 * and return the recursively constructed diff.
 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @return {Array} Array of diff tuples.
 * @private
 */
function diff_bisect_(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  var max_d = Math.ceil((text1_length + text2_length) / 2);
  var v_offset = max_d;
  var v_length = 2 * max_d;
  var v1 = new Array(v_length);
  var v2 = new Array(v_length);
  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
  // integers and undefined.
  for (var x = 0; x < v_length; x++) {
    v1[x] = -1;
    v2[x] = -1;
  }
  v1[v_offset + 1] = 0;
  v2[v_offset + 1] = 0;
  var delta = text1_length - text2_length;
  // If the total number of characters is odd, then the front path will collide
  // with the reverse path.
  var front = delta % 2 !== 0;
  // Offsets for start and end of k loop.
  // Prevents mapping of space beyond the grid.
  var k1start = 0;
  var k1end = 0;
  var k2start = 0;
  var k2end = 0;
  for (var d = 0; d < max_d; d++) {
    // Walk the front path one step.
    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
      var k1_offset = v_offset + k1;
      var x1;
      if (k1 === -d || (k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
        x1 = v1[k1_offset + 1];
      } else {
        x1 = v1[k1_offset - 1] + 1;
      }
      var y1 = x1 - k1;
      while (
        x1 < text1_length &&
        y1 < text2_length &&
        text1.charAt(x1) === text2.charAt(y1)
      ) {
        x1++;
        y1++;
      }
      v1[k1_offset] = x1;
      if (x1 > text1_length) {
        // Ran off the right of the graph.
        k1end += 2;
      } else if (y1 > text2_length) {
        // Ran off the bottom of the graph.
        k1start += 2;
      } else if (front) {
        var k2_offset = v_offset + delta - k1;
        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
          // Mirror x2 onto top-left coordinate system.
          var x2 = text1_length - v2[k2_offset];
          if (x1 >= x2) {
            // Overlap detected.
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }

    // Walk the reverse path one step.
    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
      var k2_offset = v_offset + k2;
      var x2;
      if (k2 === -d || (k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
        x2 = v2[k2_offset + 1];
      } else {
        x2 = v2[k2_offset - 1] + 1;
      }
      var y2 = x2 - k2;
      while (
        x2 < text1_length &&
        y2 < text2_length &&
        text1.charAt(text1_length - x2 - 1) ===
          text2.charAt(text2_length - y2 - 1)
      ) {
        x2++;
        y2++;
      }
      v2[k2_offset] = x2;
      if (x2 > text1_length) {
        // Ran off the left of the graph.
        k2end += 2;
      } else if (y2 > text2_length) {
        // Ran off the top of the graph.
        k2start += 2;
      } else if (!front) {
        var k1_offset = v_offset + delta - k2;
        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
          var x1 = v1[k1_offset];
          var y1 = v_offset + x1 - k1_offset;
          // Mirror x2 onto top-left coordinate system.
          x2 = text1_length - x2;
          if (x1 >= x2) {
            // Overlap detected.
            return diff_bisectSplit_(text1, text2, x1, y1);
          }
        }
      }
    }
  }
  // Diff took too long and hit the deadline or
  // number of diffs equals number of characters, no commonality at all.
  return [
    [DIFF_DELETE, text1],
    [DIFF_INSERT, text2],
  ];
}

/**
 * Given the location of the 'middle snake', split the diff in two parts
 * and recurse.
 * @param {string} text1 Old string to be diffed.
 * @param {string} text2 New string to be diffed.
 * @param {number} x Index of split point in text1.
 * @param {number} y Index of split point in text2.
 * @return {Array} Array of diff tuples.
 */
function diff_bisectSplit_(text1, text2, x, y) {
  var text1a = text1.substring(0, x);
  var text2a = text2.substring(0, y);
  var text1b = text1.substring(x);
  var text2b = text2.substring(y);

  // Compute both diffs serially.
  var diffs = diff_main(text1a, text2a);
  var diffsb = diff_main(text1b, text2b);

  return diffs.concat(diffsb);
}

/**
 * Determine the common prefix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the start of each
 *     string.
 */
function diff_commonPrefix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerstart = 0;
  while (pointermin < pointermid) {
    if (
      text1.substring(pointerstart, pointermid) ==
      text2.substring(pointerstart, pointermid)
    ) {
      pointermin = pointermid;
      pointerstart = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }

  if (is_surrogate_pair_start(text1.charCodeAt(pointermid - 1))) {
    pointermid--;
  }

  return pointermid;
}

/**
 * Determine if the suffix of one string is the prefix of another.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of the first
 *     string and the start of the second string.
 * @private
 */
function diff_commonOverlap_(text1, text2) {
  // Cache the text lengths to prevent multiple calls.
  var text1_length = text1.length;
  var text2_length = text2.length;
  // Eliminate the null case.
  if (text1_length == 0 || text2_length == 0) {
    return 0;
  }
  // Truncate the longer string.
  if (text1_length > text2_length) {
    text1 = text1.substring(text1_length - text2_length);
  } else if (text1_length < text2_length) {
    text2 = text2.substring(0, text1_length);
  }
  var text_length = Math.min(text1_length, text2_length);
  // Quick check for the worst case.
  if (text1 == text2) {
    return text_length;
  }

  // Start by looking for a single character match
  // and increase length until no match is found.
  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
  var best = 0;
  var length = 1;
  while (true) {
    var pattern = text1.substring(text_length - length);
    var found = text2.indexOf(pattern);
    if (found == -1) {
      return best;
    }
    length += found;
    if (
      found == 0 ||
      text1.substring(text_length - length) == text2.substring(0, length)
    ) {
      best = length;
      length++;
    }
  }
}

/**
 * Determine the common suffix of two strings.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {number} The number of characters common to the end of each string.
 */
function diff_commonSuffix(text1, text2) {
  // Quick check for common null cases.
  if (!text1 || !text2 || text1.slice(-1) !== text2.slice(-1)) {
    return 0;
  }
  // Binary search.
  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
  var pointermin = 0;
  var pointermax = Math.min(text1.length, text2.length);
  var pointermid = pointermax;
  var pointerend = 0;
  while (pointermin < pointermid) {
    if (
      text1.substring(text1.length - pointermid, text1.length - pointerend) ==
      text2.substring(text2.length - pointermid, text2.length - pointerend)
    ) {
      pointermin = pointermid;
      pointerend = pointermin;
    } else {
      pointermax = pointermid;
    }
    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
  }

  if (is_surrogate_pair_end(text1.charCodeAt(text1.length - pointermid))) {
    pointermid--;
  }

  return pointermid;
}

/**
 * Do the two texts share a substring which is at least half the length of the
 * longer text?
 * This speedup can produce non-minimal diffs.
 * @param {string} text1 First string.
 * @param {string} text2 Second string.
 * @return {Array.<string>} Five element Array, containing the prefix of
 *     text1, the suffix of text1, the prefix of text2, the suffix of
 *     text2 and the common middle.  Or null if there was no match.
 */
function diff_halfMatch_(text1, text2) {
  var longtext = text1.length > text2.length ? text1 : text2;
  var shorttext = text1.length > text2.length ? text2 : text1;
  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
    return null; // Pointless.
  }

  /**
   * Does a substring of shorttext exist within longtext such that the substring
   * is at least half the length of longtext?
   * Closure, but does not reference any external variables.
   * @param {string} longtext Longer string.
   * @param {string} shorttext Shorter string.
   * @param {number} i Start index of quarter length substring within longtext.
   * @return {Array.<string>} Five element Array, containing the prefix of
   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
   *     of shorttext and the common middle.  Or null if there was no match.
   * @private
   */
  function diff_halfMatchI_(longtext, shorttext, i) {
    // Start with a 1/4 length substring at position i as a seed.
    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
    var j = -1;
    var best_common = "";
    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
    while ((j = shorttext.indexOf(seed, j + 1)) !== -1) {
      var prefixLength = diff_commonPrefix(
        longtext.substring(i),
        shorttext.substring(j)
      );
      var suffixLength = diff_commonSuffix(
        longtext.substring(0, i),
        shorttext.substring(0, j)
      );
      if (best_common.length < suffixLength + prefixLength) {
        best_common =
          shorttext.substring(j - suffixLength, j) +
          shorttext.substring(j, j + prefixLength);
        best_longtext_a = longtext.substring(0, i - suffixLength);
        best_longtext_b = longtext.substring(i + prefixLength);
        best_shorttext_a = shorttext.substring(0, j - suffixLength);
        best_shorttext_b = shorttext.substring(j + prefixLength);
      }
    }
    if (best_common.length * 2 >= longtext.length) {
      return [
        best_longtext_a,
        best_longtext_b,
        best_shorttext_a,
        best_shorttext_b,
        best_common,
      ];
    } else {
      return null;
    }
  }

  // First check if the second quarter is the seed for a half-match.
  var hm1 = diff_halfMatchI_(
    longtext,
    shorttext,
    Math.ceil(longtext.length / 4)
  );
  // Check again based on the third quarter.
  var hm2 = diff_halfMatchI_(
    longtext,
    shorttext,
    Math.ceil(longtext.length / 2)
  );
  var hm;
  if (!hm1 && !hm2) {
    return null;
  } else if (!hm2) {
    hm = hm1;
  } else if (!hm1) {
    hm = hm2;
  } else {
    // Both matched.  Select the longest.
    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
  }

  // A half-match was found, sort out the return data.
  var text1_a, text1_b, text2_a, text2_b;
  if (text1.length > text2.length) {
    text1_a = hm[0];
    text1_b = hm[1];
    text2_a = hm[2];
    text2_b = hm[3];
  } else {
    text2_a = hm[0];
    text2_b = hm[1];
    text1_a = hm[2];
    text1_b = hm[3];
  }
  var mid_common = hm[4];
  return [text1_a, text1_b, text2_a, text2_b, mid_common];
}

/**
 * Reduce the number of edits by eliminating semantically trivial equalities.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
function diff_cleanupSemantic(diffs) {
  var changes = false;
  var equalities = []; // Stack of indices where equalities are found.
  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
  /** @type {?string} */
  var lastequality = null;
  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
  var pointer = 0; // Index of current position.
  // Number of characters that changed prior to the equality.
  var length_insertions1 = 0;
  var length_deletions1 = 0;
  // Number of characters that changed after the equality.
  var length_insertions2 = 0;
  var length_deletions2 = 0;
  while (pointer < diffs.length) {
    if (diffs[pointer][0] == DIFF_EQUAL) {
      // Equality found.
      equalities[equalitiesLength++] = pointer;
      length_insertions1 = length_insertions2;
      length_deletions1 = length_deletions2;
      length_insertions2 = 0;
      length_deletions2 = 0;
      lastequality = diffs[pointer][1];
    } else {
      // An insertion or deletion.
      if (diffs[pointer][0] == DIFF_INSERT) {
        length_insertions2 += diffs[pointer][1].length;
      } else {
        length_deletions2 += diffs[pointer][1].length;
      }
      // Eliminate an equality that is smaller or equal to the edits on both
      // sides of it.
      if (
        lastequality &&
        lastequality.length <=
          Math.max(length_insertions1, length_deletions1) &&
        lastequality.length <= Math.max(length_insertions2, length_deletions2)
      ) {
        // Duplicate record.
        diffs.splice(equalities[equalitiesLength - 1], 0, [
          DIFF_DELETE,
          lastequality,
        ]);
        // Change second copy to insert.
        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
        // Throw away the equality we just deleted.
        equalitiesLength--;
        // Throw away the previous equality (it needs to be reevaluated).
        equalitiesLength--;
        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
        length_insertions1 = 0; // Reset the counters.
        length_deletions1 = 0;
        length_insertions2 = 0;
        length_deletions2 = 0;
        lastequality = null;
        changes = true;
      }
    }
    pointer++;
  }

  // Normalize the diff.
  if (changes) {
    diff_cleanupMerge(diffs);
  }
  diff_cleanupSemanticLossless(diffs);

  // Find any overlaps between deletions and insertions.
  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
  //   -> <del>abc</del>xxx<ins>def</ins>
  // e.g: <del>xxxabc</del><ins>defxxx</ins>
  //   -> <ins>def</ins>xxx<del>abc</del>
  // Only extract an overlap if it is as big as the edit ahead or behind it.
  pointer = 1;
  while (pointer < diffs.length) {
    if (
      diffs[pointer - 1][0] == DIFF_DELETE &&
      diffs[pointer][0] == DIFF_INSERT
    ) {
      var deletion = diffs[pointer - 1][1];
      var insertion = diffs[pointer][1];
      var overlap_length1 = diff_commonOverlap_(deletion, insertion);
      var overlap_length2 = diff_commonOverlap_(insertion, deletion);
      if (overlap_length1 >= overlap_length2) {
        if (
          overlap_length1 >= deletion.length / 2 ||
          overlap_length1 >= insertion.length / 2
        ) {
          // Overlap found.  Insert an equality and trim the surrounding edits.
          diffs.splice(pointer, 0, [
            DIFF_EQUAL,
            insertion.substring(0, overlap_length1),
          ]);
          diffs[pointer - 1][1] = deletion.substring(
            0,
            deletion.length - overlap_length1
          );
          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
          pointer++;
        }
      } else {
        if (
          overlap_length2 >= deletion.length / 2 ||
          overlap_length2 >= insertion.length / 2
        ) {
          // Reverse overlap found.
          // Insert an equality and swap and trim the surrounding edits.
          diffs.splice(pointer, 0, [
            DIFF_EQUAL,
            deletion.substring(0, overlap_length2),
          ]);
          diffs[pointer - 1][0] = DIFF_INSERT;
          diffs[pointer - 1][1] = insertion.substring(
            0,
            insertion.length - overlap_length2
          );
          diffs[pointer + 1][0] = DIFF_DELETE;
          diffs[pointer + 1][1] = deletion.substring(overlap_length2);
          pointer++;
        }
      }
      pointer++;
    }
    pointer++;
  }
}

var nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
var whitespaceRegex_ = /\s/;
var linebreakRegex_ = /[\r\n]/;
var blanklineEndRegex_ = /\n\r?\n$/;
var blanklineStartRegex_ = /^\r?\n\r?\n/;

/**
 * Look for single edits surrounded on both sides by equalities
 * which can be shifted sideways to align the edit to a word boundary.
 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
 */
function diff_cleanupSemanticLossless(diffs) {
  /**
   * Given two strings, compute a score representing whether the internal
   * boundary falls on logical boundaries.
   * Scores range from 6 (best) to 0 (worst).
   * Closure, but does not reference any external variables.
   * @param {string} one First string.
   * @param {string} two Second string.
   * @return {number} The score.
   * @private
   */
  function diff_cleanupSemanticScore_(one, two) {
    if (!one || !two) {
      // Edges are the best.
      return 6;
    }

    // Each port of this function behaves slightly differently due to
    // subtle differences in each language's definition of things like
    // 'whitespace'.  Since this function's purpose is largely cosmetic,
    // the choice has been made to use each language's native features
    // rather than force total conformity.
    var char1 = one.charAt(one.length - 1);
    var char2 = two.charAt(0);
    var nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex_);
    var nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex_);
    var whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex_);
    var whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex_);
    var lineBreak1 = whitespace1 && char1.match(linebreakRegex_);
    var lineBreak2 = whitespace2 && char2.match(linebreakRegex_);
    var blankLine1 = lineBreak1 && one.match(blanklineEndRegex_);
    var blankLine2 = lineBreak2 && two.match(blanklineStartRegex_);

    if (blankLine1 || blankLine2) {
      // Five points for blank lines.
      return 5;
    } else if (lineBreak1 || lineBreak2) {
      // Four points for line breaks.
      return 4;
    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
      // Three points for end of sentences.
      return 3;
    } else if (whitespace1 || whitespace2) {
      // Two points for whitespace.
      return 2;
    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
      // One point for non-alphanumeric.
      return 1;
    }
    return 0;
  }

  var pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (
      diffs[pointer - 1][0] == DIFF_EQUAL &&
      diffs[pointer + 1][0] == DIFF_EQUAL
    ) {
      // This is a single edit surrounded by equalities.
      var equality1 = diffs[pointer - 1][1];
      var edit = diffs[pointer][1];
      var equality2 = diffs[pointer + 1][1];

      // First, shift the edit as far left as possible.
      var commonOffset = diff_commonSuffix(equality1, edit);
      if (commonOffset) {
        var commonString = edit.substring(edit.length - commonOffset);
        equality1 = equality1.substring(0, equality1.length - commonOffset);
        edit = commonString + edit.substring(0, edit.length - commonOffset);
        equality2 = commonString + equality2;
      }

      // Second, step character by character right, looking for the best fit.
      var bestEquality1 = equality1;
      var bestEdit = edit;
      var bestEquality2 = equality2;
      var bestScore =
        diff_cleanupSemanticScore_(equality1, edit) +
        diff_cleanupSemanticScore_(edit, equality2);
      while (edit.charAt(0) === equality2.charAt(0)) {
        equality1 += edit.charAt(0);
        edit = edit.substring(1) + equality2.charAt(0);
        equality2 = equality2.substring(1);
        var score =
          diff_cleanupSemanticScore_(equality1, edit) +
          diff_cleanupSemanticScore_(edit, equality2);
        // The >= encourages trailing rather than leading whitespace on edits.
        if (score >= bestScore) {
          bestScore = score;
          bestEquality1 = equality1;
          bestEdit = edit;
          bestEquality2 = equality2;
        }
      }

      if (diffs[pointer - 1][1] != bestEquality1) {
        // We have an improvement, save it back to the diff.
        if (bestEquality1) {
          diffs[pointer - 1][1] = bestEquality1;
        } else {
          diffs.splice(pointer - 1, 1);
          pointer--;
        }
        diffs[pointer][1] = bestEdit;
        if (bestEquality2) {
          diffs[pointer + 1][1] = bestEquality2;
        } else {
          diffs.splice(pointer + 1, 1);
          pointer--;
        }
      }
    }
    pointer++;
  }
}

/**
 * Reorder and merge like edit sections.  Merge equalities.
 * Any edit section can move as long as it doesn't cross an equality.
 * @param {Array} diffs Array of diff tuples.
 * @param {boolean} fix_unicode Whether to normalize to a unicode-correct diff
 */
function diff_cleanupMerge(diffs, fix_unicode) {
  diffs.push([DIFF_EQUAL, ""]); // Add a dummy entry at the end.
  var pointer = 0;
  var count_delete = 0;
  var count_insert = 0;
  var text_delete = "";
  var text_insert = "";
  var commonlength;
  while (pointer < diffs.length) {
    if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
      diffs.splice(pointer, 1);
      continue;
    }
    switch (diffs[pointer][0]) {
      case DIFF_INSERT:
        count_insert++;
        text_insert += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_DELETE:
        count_delete++;
        text_delete += diffs[pointer][1];
        pointer++;
        break;
      case DIFF_EQUAL:
        var previous_equality = pointer - count_insert - count_delete - 1;
        if (fix_unicode) {
          // prevent splitting of unicode surrogate pairs.  when fix_unicode is true,
          // we assume that the old and new text in the diff are complete and correct
          // unicode-encoded JS strings, but the tuple boundaries may fall between
          // surrogate pairs.  we fix this by shaving off stray surrogates from the end
          // of the previous equality and the beginning of this equality.  this may create
          // empty equalities or a common prefix or suffix.  for example, if AB and AC are
          // emojis, `[[0, 'A'], [-1, 'BA'], [0, 'C']]` would turn into deleting 'ABAC' and
          // inserting 'AC', and then the common suffix 'AC' will be eliminated.  in this
          // particular case, both equalities go away, we absorb any previous inequalities,
          // and we keep scanning for the next equality before rewriting the tuples.
          if (
            previous_equality >= 0 &&
            ends_with_pair_start(diffs[previous_equality][1])
          ) {
            var stray = diffs[previous_equality][1].slice(-1);
            diffs[previous_equality][1] = diffs[previous_equality][1].slice(
              0,
              -1
            );
            text_delete = stray + text_delete;
            text_insert = stray + text_insert;
            if (!diffs[previous_equality][1]) {
              // emptied out previous equality, so delete it and include previous delete/insert
              diffs.splice(previous_equality, 1);
              pointer--;
              var k = previous_equality - 1;
              if (diffs[k] && diffs[k][0] === DIFF_INSERT) {
                count_insert++;
                text_insert = diffs[k][1] + text_insert;
                k--;
              }
              if (diffs[k] && diffs[k][0] === DIFF_DELETE) {
                count_delete++;
                text_delete = diffs[k][1] + text_delete;
                k--;
              }
              previous_equality = k;
            }
          }
          if (starts_with_pair_end(diffs[pointer][1])) {
            var stray = diffs[pointer][1].charAt(0);
            diffs[pointer][1] = diffs[pointer][1].slice(1);
            text_delete += stray;
            text_insert += stray;
          }
        }
        if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
          // for empty equality not at end, wait for next equality
          diffs.splice(pointer, 1);
          break;
        }
        if (text_delete.length > 0 || text_insert.length > 0) {
          // note that diff_commonPrefix and diff_commonSuffix are unicode-aware
          if (text_delete.length > 0 && text_insert.length > 0) {
            // Factor out any common prefixes.
            commonlength = diff_commonPrefix(text_insert, text_delete);
            if (commonlength !== 0) {
              if (previous_equality >= 0) {
                diffs[previous_equality][1] += text_insert.substring(
                  0,
                  commonlength
                );
              } else {
                diffs.splice(0, 0, [
                  DIFF_EQUAL,
                  text_insert.substring(0, commonlength),
                ]);
                pointer++;
              }
              text_insert = text_insert.substring(commonlength);
              text_delete = text_delete.substring(commonlength);
            }
            // Factor out any common suffixes.
            commonlength = diff_commonSuffix(text_insert, text_delete);
            if (commonlength !== 0) {
              diffs[pointer][1] =
                text_insert.substring(text_insert.length - commonlength) +
                diffs[pointer][1];
              text_insert = text_insert.substring(
                0,
                text_insert.length - commonlength
              );
              text_delete = text_delete.substring(
                0,
                text_delete.length - commonlength
              );
            }
          }
          // Delete the offending records and add the merged ones.
          var n = count_insert + count_delete;
          if (text_delete.length === 0 && text_insert.length === 0) {
            diffs.splice(pointer - n, n);
            pointer = pointer - n;
          } else if (text_delete.length === 0) {
            diffs.splice(pointer - n, n, [DIFF_INSERT, text_insert]);
            pointer = pointer - n + 1;
          } else if (text_insert.length === 0) {
            diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete]);
            pointer = pointer - n + 1;
          } else {
            diffs.splice(
              pointer - n,
              n,
              [DIFF_DELETE, text_delete],
              [DIFF_INSERT, text_insert]
            );
            pointer = pointer - n + 2;
          }
        }
        if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
          // Merge this equality with the previous one.
          diffs[pointer - 1][1] += diffs[pointer][1];
          diffs.splice(pointer, 1);
        } else {
          pointer++;
        }
        count_insert = 0;
        count_delete = 0;
        text_delete = "";
        text_insert = "";
        break;
    }
  }
  if (diffs[diffs.length - 1][1] === "") {
    diffs.pop(); // Remove the dummy entry at the end.
  }

  // Second pass: look for single edits surrounded on both sides by equalities
  // which can be shifted sideways to eliminate an equality.
  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
  var changes = false;
  pointer = 1;
  // Intentionally ignore the first and last element (don't need checking).
  while (pointer < diffs.length - 1) {
    if (
      diffs[pointer - 1][0] === DIFF_EQUAL &&
      diffs[pointer + 1][0] === DIFF_EQUAL
    ) {
      // This is a single edit surrounded by equalities.
      if (
        diffs[pointer][1].substring(
          diffs[pointer][1].length - diffs[pointer - 1][1].length
        ) === diffs[pointer - 1][1]
      ) {
        // Shift the edit over the previous equality.
        diffs[pointer][1] =
          diffs[pointer - 1][1] +
          diffs[pointer][1].substring(
            0,
            diffs[pointer][1].length - diffs[pointer - 1][1].length
          );
        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
        diffs.splice(pointer - 1, 1);
        changes = true;
      } else if (
        diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
        diffs[pointer + 1][1]
      ) {
        // Shift the edit over the next equality.
        diffs[pointer - 1][1] += diffs[pointer + 1][1];
        diffs[pointer][1] =
          diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
          diffs[pointer + 1][1];
        diffs.splice(pointer + 1, 1);
        changes = true;
      }
    }
    pointer++;
  }
  // If shifts were made, the diff needs reordering and another shift sweep.
  if (changes) {
    diff_cleanupMerge(diffs, fix_unicode);
  }
}

function is_surrogate_pair_start(charCode) {
  return charCode >= 0xd800 && charCode <= 0xdbff;
}

function is_surrogate_pair_end(charCode) {
  return charCode >= 0xdc00 && charCode <= 0xdfff;
}

function starts_with_pair_end(str) {
  return is_surrogate_pair_end(str.charCodeAt(0));
}

function ends_with_pair_start(str) {
  return is_surrogate_pair_start(str.charCodeAt(str.length - 1));
}

function remove_empty_tuples(tuples) {
  var ret = [];
  for (var i = 0; i < tuples.length; i++) {
    if (tuples[i][1].length > 0) {
      ret.push(tuples[i]);
    }
  }
  return ret;
}

function make_edit_splice(before, oldMiddle, newMiddle, after) {
  if (ends_with_pair_start(before) || starts_with_pair_end(after)) {
    return null;
  }
  return remove_empty_tuples([
    [DIFF_EQUAL, before],
    [DIFF_DELETE, oldMiddle],
    [DIFF_INSERT, newMiddle],
    [DIFF_EQUAL, after],
  ]);
}

function find_cursor_edit_diff(oldText, newText, cursor_pos) {
  // note: this runs after equality check has ruled out exact equality
  var oldRange =
    typeof cursor_pos === "number"
      ? { index: cursor_pos, length: 0 }
      : cursor_pos.oldRange;
  var newRange = typeof cursor_pos === "number" ? null : cursor_pos.newRange;
  // take into account the old and new selection to generate the best diff
  // possible for a text edit.  for example, a text change from "xxx" to "xx"
  // could be a delete or forwards-delete of any one of the x's, or the
  // result of selecting two of the x's and typing "x".
  var oldLength = oldText.length;
  var newLength = newText.length;
  if (oldRange.length === 0 && (newRange === null || newRange.length === 0)) {
    // see if we have an insert or delete before or after cursor
    var oldCursor = oldRange.index;
    var oldBefore = oldText.slice(0, oldCursor);
    var oldAfter = oldText.slice(oldCursor);
    var maybeNewCursor = newRange ? newRange.index : null;
    editBefore: {
      // is this an insert or delete right before oldCursor?
      var newCursor = oldCursor + newLength - oldLength;
      if (maybeNewCursor !== null && maybeNewCursor !== newCursor) {
        break editBefore;
      }
      if (newCursor < 0 || newCursor > newLength) {
        break editBefore;
      }
      var newBefore = newText.slice(0, newCursor);
      var newAfter = newText.slice(newCursor);
      if (newAfter !== oldAfter) {
        break editBefore;
      }
      var prefixLength = Math.min(oldCursor, newCursor);
      var oldPrefix = oldBefore.slice(0, prefixLength);
      var newPrefix = newBefore.slice(0, prefixLength);
      if (oldPrefix !== newPrefix) {
        break editBefore;
      }
      var oldMiddle = oldBefore.slice(prefixLength);
      var newMiddle = newBefore.slice(prefixLength);
      return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldAfter);
    }
    editAfter: {
      // is this an insert or delete right after oldCursor?
      if (maybeNewCursor !== null && maybeNewCursor !== oldCursor) {
        break editAfter;
      }
      var cursor = oldCursor;
      var newBefore = newText.slice(0, cursor);
      var newAfter = newText.slice(cursor);
      if (newBefore !== oldBefore) {
        break editAfter;
      }
      var suffixLength = Math.min(oldLength - cursor, newLength - cursor);
      var oldSuffix = oldAfter.slice(oldAfter.length - suffixLength);
      var newSuffix = newAfter.slice(newAfter.length - suffixLength);
      if (oldSuffix !== newSuffix) {
        break editAfter;
      }
      var oldMiddle = oldAfter.slice(0, oldAfter.length - suffixLength);
      var newMiddle = newAfter.slice(0, newAfter.length - suffixLength);
      return make_edit_splice(oldBefore, oldMiddle, newMiddle, oldSuffix);
    }
  }
  if (oldRange.length > 0 && newRange && newRange.length === 0) {
    replaceRange: {
      // see if diff could be a splice of the old selection range
      var oldPrefix = oldText.slice(0, oldRange.index);
      var oldSuffix = oldText.slice(oldRange.index + oldRange.length);
      var prefixLength = oldPrefix.length;
      var suffixLength = oldSuffix.length;
      if (newLength < prefixLength + suffixLength) {
        break replaceRange;
      }
      var newPrefix = newText.slice(0, prefixLength);
      var newSuffix = newText.slice(newLength - suffixLength);
      if (oldPrefix !== newPrefix || oldSuffix !== newSuffix) {
        break replaceRange;
      }
      var oldMiddle = oldText.slice(prefixLength, oldLength - suffixLength);
      var newMiddle = newText.slice(prefixLength, newLength - suffixLength);
      return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldSuffix);
    }
  }

  return null;
}

function diff$1(text1, text2, cursor_pos, cleanup) {
  // only pass fix_unicode=true at the top level, not when diff_main is
  // recursively invoked
  return diff_main(text1, text2, cursor_pos, cleanup, true);
}

diff$1.INSERT = DIFF_INSERT;
diff$1.DELETE = DIFF_DELETE;
diff$1.EQUAL = DIFF_EQUAL;

var diff_1 = diff$1;

const diff = diff_1;

const LINE_ENDING_RE = /\r\n|[\r\n\u2028\u2029]/;

/**
 * Converts invisible characters to a commonly recognizable visible form.
 * @param {string} str - The string with invisibles to convert.
 * @returns {string} The converted string.
 */
function showInvisibles$1(str) {
  let ret = '';
  for (let i = 0; i < str.length; i++) {
    switch (str[i]) {
      case ' ':
        ret += '·'; // Middle Dot, \u00B7
        break;
      case '\n':
        ret += '⏎'; // Return Symbol, \u23ce
        break;
      case '\t':
        ret += '↹'; // Left Arrow To Bar Over Right Arrow To Bar, \u21b9
        break;
      case '\r':
        ret += '␍'; // Carriage Return Symbol, \u240D
        break;
      default:
        ret += str[i];
        break;
    }
  }
  return ret;
}

/**
 * Generate results for differences between source code and formatted version.
 *
 * @param {string} source - The original source.
 * @param {string} prettierSource - The Prettier formatted source.
 * @returns {Array} - An array containing { operation, offset, insertText, deleteText }
 */
function generateDifferences$1(source, prettierSource) {
  // fast-diff returns the differences between two texts as a series of
  // INSERT, DELETE or EQUAL operations. The results occur only in these
  // sequences:
  //           /-> INSERT -> EQUAL
  //    EQUAL |           /-> EQUAL
  //           \-> DELETE |
  //                      \-> INSERT -> EQUAL
  // Instead of reporting issues at each INSERT or DELETE, certain sequences
  // are batched together and are reported as a friendlier "replace" operation:
  // - A DELETE immediately followed by an INSERT.
  // - Any number of INSERTs and DELETEs where the joining EQUAL of one's end
  // and another's beginning does not have line endings (i.e. issues that occur
  // on contiguous lines).

  const results = diff(source, prettierSource);
  const differences = [];

  const batch = [];
  let offset = 0; // NOTE: INSERT never advances the offset.
  while (results.length) {
    const result = results.shift();
    const op = result[0];
    const text = result[1];
    switch (op) {
      case diff.INSERT:
      case diff.DELETE:
        batch.push(result);
        break;
      case diff.EQUAL:
        if (results.length) {
          if (batch.length) {
            if (LINE_ENDING_RE.test(text)) {
              flush();
              offset += text.length;
            } else {
              batch.push(result);
            }
          } else {
            offset += text.length;
          }
        }
        break;
      default:
        throw new Error(`Unexpected fast-diff operation "${op}"`);
    }
    if (batch.length && !results.length) {
      flush();
    }
  }

  return differences;

  function flush() {
    let aheadDeleteText = '';
    let aheadInsertText = '';
    while (batch.length) {
      const next = batch.shift();
      const op = next[0];
      const text = next[1];
      switch (op) {
        case diff.INSERT:
          aheadInsertText += text;
          break;
        case diff.DELETE:
          aheadDeleteText += text;
          break;
        case diff.EQUAL:
          aheadDeleteText += text;
          aheadInsertText += text;
          break;
      }
    }
    if (aheadDeleteText && aheadInsertText) {
      differences.push({
        offset,
        operation: generateDifferences$1.REPLACE,
        insertText: aheadInsertText,
        deleteText: aheadDeleteText,
      });
    } else if (!aheadDeleteText && aheadInsertText) {
      differences.push({
        offset,
        operation: generateDifferences$1.INSERT,
        insertText: aheadInsertText,
      });
    } else if (aheadDeleteText && !aheadInsertText) {
      differences.push({
        offset,
        operation: generateDifferences$1.DELETE,
        deleteText: aheadDeleteText,
      });
    }
    offset += aheadDeleteText.length;
  }
}

generateDifferences$1.INSERT = 'insert';
generateDifferences$1.DELETE = 'delete';
generateDifferences$1.REPLACE = 'replace';

var prettierLinterHelpers = {
  showInvisibles: showInvisibles$1,
  generateDifferences: generateDifferences$1,
};

var name$1 = "eslint-plugin-prettier";
var version$1 = "5.1.3";
var description = "Runs prettier as an eslint rule";
var repository = "git+https://github.com/prettier/eslint-plugin-prettier.git";
var homepage = "https://github.com/prettier/eslint-plugin-prettier#readme";
var author = "Teddy Katz";
var contributors = [
	"JounQin (https://github.com/JounQin) <admin@1stg.me>"
];
var funding = "https://opencollective.com/eslint-plugin-prettier";
var license = "MIT";
var packageManager = "pnpm@7.33.5";
var engines = {
	node: "^14.18.0 || >=16.0.0"
};
var main = "eslint-plugin-prettier.js";
var exports$1 = {
	".": {
		types: "./eslint-plugin-prettier.d.ts",
		"default": "./eslint-plugin-prettier.js"
	},
	"./recommended": {
		types: "./recommended.d.ts",
		"default": "./recommended.js"
	},
	"./package.json": "./package.json"
};
var types = "eslint-plugin-prettier.d.ts";
var files = [
	"eslint-plugin-prettier.d.ts",
	"eslint-plugin-prettier.js",
	"recommended.d.ts",
	"recommended.js",
	"worker.js"
];
var keywords = [
	"eslint",
	"eslintplugin",
	"eslint-plugin",
	"prettier"
];
var peerDependencies = {
	"@types/eslint": ">=8.0.0",
	eslint: ">=8.0.0",
	"eslint-config-prettier": "*",
	prettier: ">=3.0.0"
};
var peerDependenciesMeta = {
	"@types/eslint": {
		optional: true
	},
	"eslint-config-prettier": {
		optional: true
	}
};
var dependencies = {
	"prettier-linter-helpers": "^1.0.0",
	synckit: "^0.8.6"
};
var devDependencies = {
	"@1stg/remark-preset": "^2.0.0",
	"@changesets/changelog-github": "^0.5.0",
	"@changesets/cli": "^2.27.1",
	"@commitlint/config-conventional": "^18.4.3",
	"@eslint-community/eslint-plugin-eslint-comments": "^4.1.0",
	"@eslint/js": "^8.56.0",
	"@graphql-eslint/eslint-plugin": "^3.20.1",
	"@prettier/plugin-pug": "^3.0.0",
	"@types/eslint": "^8.56.0",
	"@types/prettier-linter-helpers": "^1.0.4",
	commitlint: "^18.4.3",
	eslint: "^8.56.0",
	"eslint-config-prettier": "^9.1.0",
	"eslint-formatter-friendly": "^7.0.0",
	"eslint-mdx": "^2.3.0",
	"eslint-plugin-eslint-plugin": "^5.2.1",
	"eslint-plugin-mdx": "^2.3.0",
	"eslint-plugin-n": "^16.5.0",
	"eslint-plugin-prettier": "link:.",
	"eslint-plugin-pug": "^1.2.5",
	"eslint-plugin-svelte": "^2.35.1",
	"eslint-plugin-svelte3": "^4.0.0",
	graphql: "^16.8.1",
	"lint-staged": "^15.2.0",
	mocha: "^10.2.0",
	prettier: "^3.1.1",
	"prettier-plugin-pkg": "^0.18.0",
	"prettier-plugin-svelte": "^3.1.2",
	"simple-git-hooks": "^2.9.0",
	svelte: "^4.2.8",
	"vue-eslint-parser": "^9.3.2"
};
var scripts = {
	check: "prettier --check . && pnpm lint",
	format: "prettier --write . && pnpm lint --fix",
	lint: "eslint . --cache -f friendly --max-warnings 10",
	release: "pnpm check && pnpm test && changeset publish",
	test: "pnpm lint && mocha"
};
var require$$1 = {
	name: name$1,
	version: version$1,
	description: description,
	repository: repository,
	homepage: homepage,
	author: author,
	contributors: contributors,
	funding: funding,
	license: license,
	packageManager: packageManager,
	engines: engines,
	main: main,
	exports: exports$1,
	types: types,
	files: files,
	keywords: keywords,
	peerDependencies: peerDependencies,
	peerDependenciesMeta: peerDependenciesMeta,
	dependencies: dependencies,
	devDependencies: devDependencies,
	scripts: scripts
};

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var lib$1 = {};

var lib = {};

var hasRequiredLib$1;

function requireLib$1 () {
	if (hasRequiredLib$1) return lib;
	hasRequiredLib$1 = 1;

	var node_module = require$$0;
	var fs = require$$1$1;
	var path = require$$2;

	const import_meta = {};
	const CWD = process.cwd();
	const cjsRequire = typeof commonjsRequire === "undefined" ? node_module.createRequire(import_meta.url) : commonjsRequire;
	const EXTENSIONS = [".ts", ".tsx", ...Object.keys(cjsRequire.extensions)];

	const tryPkg = (pkg) => {
	  try {
	    return cjsRequire.resolve(pkg);
	  } catch (e) {
	  }
	};
	const isPkgAvailable = (pkg) => !!tryPkg(pkg);
	const tryFile = (filePath, includeDir = false) => {
	  if (typeof filePath === "string") {
	    return fs.existsSync(filePath) && (includeDir || fs.statSync(filePath).isFile()) ? filePath : "";
	  }
	  for (const file of filePath != null ? filePath : []) {
	    if (tryFile(file, includeDir)) {
	      return file;
	    }
	  }
	  return "";
	};
	const tryExtensions = (filepath, extensions = EXTENSIONS) => {
	  const ext = [...extensions, ""].find((ext2) => tryFile(filepath + ext2));
	  return ext == null ? "" : filepath + ext;
	};
	const findUp = (searchEntry, searchFileOrIncludeDir, includeDir) => {
	  console.assert(path.isAbsolute(searchEntry));
	  if (!tryFile(searchEntry, true) || searchEntry !== CWD && !searchEntry.startsWith(CWD + path.sep)) {
	    return "";
	  }
	  searchEntry = path.resolve(
	    fs.statSync(searchEntry).isDirectory() ? searchEntry : path.resolve(searchEntry, "..")
	  );
	  const isSearchFile = typeof searchFileOrIncludeDir === "string";
	  const searchFile = isSearchFile ? searchFileOrIncludeDir : "package.json";
	  do {
	    const searched = tryFile(
	      path.resolve(searchEntry, searchFile),
	      isSearchFile && includeDir
	    );
	    if (searched) {
	      return searched;
	    }
	    searchEntry = path.resolve(searchEntry, "..");
	  } while (searchEntry === CWD || searchEntry.startsWith(CWD + path.sep));
	  return "";
	};

	lib.CWD = CWD;
	lib.EXTENSIONS = EXTENSIONS;
	lib.cjsRequire = cjsRequire;
	lib.findUp = findUp;
	lib.isPkgAvailable = isPkgAvailable;
	lib.tryExtensions = tryExtensions;
	lib.tryFile = tryFile;
	lib.tryPkg = tryPkg;
	return lib;
}

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib$1;
	hasRequiredLib = 1;

	var node_crypto = require$$0$1;
	var fs = require$$1$1;
	var node_module = require$$0;
	var path = require$$2;
	var node_url = require$$4;
	var node_worker_threads = require$$5;
	var core = requireLib$1();

	var __async = (__this, __arguments, generator) => {
	  return new Promise((resolve, reject) => {
	    var fulfilled = (value) => {
	      try {
	        step(generator.next(value));
	      } catch (e) {
	        reject(e);
	      }
	    };
	    var rejected = (value) => {
	      try {
	        step(generator.throw(value));
	      } catch (e) {
	        reject(e);
	      }
	    };
	    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
	    step((generator = generator.apply(__this, __arguments)).next());
	  });
	};
	const import_meta = {};
	const TsRunner = {
	  // https://github.com/TypeStrong/ts-node
	  TsNode: "ts-node",
	  // https://github.com/egoist/esbuild-register
	  EsbuildRegister: "esbuild-register",
	  // https://github.com/folke/esbuild-runner
	  EsbuildRunner: "esbuild-runner",
	  // https://github.com/swc-project/swc-node/tree/master/packages/register
	  SWC: "swc",
	  // https://github.com/esbuild-kit/tsx
	  TSX: "tsx"
	};
	const {
	  SYNCKIT_BUFFER_SIZE,
	  SYNCKIT_TIMEOUT,
	  SYNCKIT_EXEC_ARGV,
	  SYNCKIT_TS_RUNNER,
	  SYNCKIT_GLOBAL_SHIMS,
	  NODE_OPTIONS
	} = process.env;
	const DEFAULT_BUFFER_SIZE = SYNCKIT_BUFFER_SIZE ? +SYNCKIT_BUFFER_SIZE : void 0;
	const DEFAULT_TIMEOUT = SYNCKIT_TIMEOUT ? +SYNCKIT_TIMEOUT : void 0;
	const DEFAULT_WORKER_BUFFER_SIZE = DEFAULT_BUFFER_SIZE || 1024;
	const DEFAULT_EXEC_ARGV = (SYNCKIT_EXEC_ARGV == null ? void 0 : SYNCKIT_EXEC_ARGV.split(",")) || [];
	const DEFAULT_TS_RUNNER = SYNCKIT_TS_RUNNER;
	const DEFAULT_GLOBAL_SHIMS = ["1", "true"].includes(
	  SYNCKIT_GLOBAL_SHIMS
	);
	const DEFAULT_GLOBAL_SHIMS_PRESET = [
	  {
	    moduleName: "node-fetch",
	    globalName: "fetch"
	  },
	  {
	    moduleName: "node:perf_hooks",
	    globalName: "performance",
	    named: "performance"
	  }
	];
	const MTS_SUPPORTED_NODE_VERSION = 16;
	const syncFnCache = /* @__PURE__ */ new Map();
	function extractProperties(object) {
	  if (object && typeof object === "object") {
	    const properties = {};
	    for (const key in object) {
	      properties[key] = object[key];
	    }
	    return properties;
	  }
	}
	function createSyncFn(workerPath, bufferSizeOrOptions, timeout) {
	  if (!path.isAbsolute(workerPath)) {
	    throw new Error("`workerPath` must be absolute");
	  }
	  const cachedSyncFn = syncFnCache.get(workerPath);
	  if (cachedSyncFn) {
	    return cachedSyncFn;
	  }
	  const syncFn = startWorkerThread(
	    workerPath,
	    /* istanbul ignore next */
	    typeof bufferSizeOrOptions === "number" ? { bufferSize: bufferSizeOrOptions, timeout } : bufferSizeOrOptions
	  );
	  syncFnCache.set(workerPath, syncFn);
	  return syncFn;
	}
	const cjsRequire = typeof commonjsRequire === "undefined" ? node_module.createRequire(import_meta.url) : (
	  /* istanbul ignore next */
	  commonjsRequire
	);
	const dataUrl = (code) => new URL(`data:text/javascript,${encodeURIComponent(code)}`);
	const isFile = (path2) => {
	  var _a;
	  try {
	    return !!((_a = fs.statSync(path2, { throwIfNoEntry: false })) == null ? void 0 : _a.isFile());
	  } catch (e) {
	    return false;
	  }
	};
	const setupTsRunner = (workerPath, { execArgv, tsRunner }) => {
	  let ext = path.extname(workerPath);
	  if (!/[/\\]node_modules[/\\]/.test(workerPath) && (!ext || /^\.[cm]?js$/.test(ext))) {
	    const workPathWithoutExt = ext ? workerPath.slice(0, -ext.length) : workerPath;
	    let extensions;
	    switch (ext) {
	      case ".cjs": {
	        extensions = [".cts", ".cjs"];
	        break;
	      }
	      case ".mjs": {
	        extensions = [".mts", ".mjs"];
	        break;
	      }
	      default: {
	        extensions = [".ts", ".js"];
	        break;
	      }
	    }
	    const found = core.tryExtensions(workPathWithoutExt, extensions);
	    let differentExt;
	    if (found && (!ext || (differentExt = found !== workPathWithoutExt))) {
	      workerPath = found;
	      if (differentExt) {
	        ext = path.extname(workerPath);
	      }
	    }
	  }
	  const isTs = /\.[cm]?ts$/.test(workerPath);
	  let jsUseEsm = workerPath.endsWith(".mjs");
	  let tsUseEsm = workerPath.endsWith(".mts");
	  if (isTs) {
	    if (!tsUseEsm) {
	      const pkg = core.findUp(workerPath);
	      if (pkg) {
	        tsUseEsm = cjsRequire(pkg).type === "module";
	      }
	    }
	    if (tsRunner == null && core.isPkgAvailable(TsRunner.TsNode)) {
	      tsRunner = TsRunner.TsNode;
	    }
	    switch (tsRunner) {
	      case TsRunner.TsNode: {
	        if (tsUseEsm) {
	          if (!execArgv.includes("--loader")) {
	            execArgv = ["--loader", `${TsRunner.TsNode}/esm`, ...execArgv];
	          }
	        } else if (!execArgv.includes("-r")) {
	          execArgv = ["-r", `${TsRunner.TsNode}/register`, ...execArgv];
	        }
	        break;
	      }
	      case TsRunner.EsbuildRegister: {
	        if (!execArgv.includes("-r")) {
	          execArgv = ["-r", TsRunner.EsbuildRegister, ...execArgv];
	        }
	        break;
	      }
	      case TsRunner.EsbuildRunner: {
	        if (!execArgv.includes("-r")) {
	          execArgv = ["-r", `${TsRunner.EsbuildRunner}/register`, ...execArgv];
	        }
	        break;
	      }
	      case TsRunner.SWC: {
	        if (!execArgv.includes("-r")) {
	          execArgv = ["-r", `@${TsRunner.SWC}-node/register`, ...execArgv];
	        }
	        break;
	      }
	      case TsRunner.TSX: {
	        if (!execArgv.includes("--loader")) {
	          execArgv = ["--loader", TsRunner.TSX, ...execArgv];
	        }
	        break;
	      }
	      default: {
	        throw new Error(`Unknown ts runner: ${String(tsRunner)}`);
	      }
	    }
	  } else if (!jsUseEsm) {
	    const pkg = core.findUp(workerPath);
	    if (pkg) {
	      jsUseEsm = cjsRequire(pkg).type === "module";
	    }
	  }
	  if (process.versions.pnp) {
	    const nodeOptions = NODE_OPTIONS == null ? void 0 : NODE_OPTIONS.split(/\s+/);
	    let pnpApiPath;
	    try {
	      pnpApiPath = cjsRequire.resolve("pnpapi");
	    } catch (e) {
	    }
	    if (pnpApiPath && !(nodeOptions == null ? void 0 : nodeOptions.some(
	      (option, index) => ["-r", "--require"].includes(option) && pnpApiPath === cjsRequire.resolve(nodeOptions[index + 1])
	    )) && !execArgv.includes(pnpApiPath)) {
	      execArgv = ["-r", pnpApiPath, ...execArgv];
	      const pnpLoaderPath = path.resolve(pnpApiPath, "../.pnp.loader.mjs");
	      if (isFile(pnpLoaderPath)) {
	        const experimentalLoader = node_url.pathToFileURL(pnpLoaderPath).toString();
	        execArgv = ["--experimental-loader", experimentalLoader, ...execArgv];
	      }
	    }
	  }
	  return {
	    ext,
	    isTs,
	    jsUseEsm,
	    tsRunner,
	    tsUseEsm,
	    workerPath,
	    execArgv
	  };
	};
	const md5Hash = (text) => node_crypto.createHash("md5").update(text).digest("hex");
	const encodeImportModule = (moduleNameOrGlobalShim, type = "import") => {
	  const { moduleName, globalName, named, conditional } = typeof moduleNameOrGlobalShim === "string" ? { moduleName: moduleNameOrGlobalShim } : moduleNameOrGlobalShim;
	  const importStatement = type === "import" ? `import${globalName ? " " + (named === null ? "* as " + globalName : (named == null ? void 0 : named.trim()) ? `{${named}}` : globalName) + " from" : ""} '${path.isAbsolute(moduleName) ? String(node_url.pathToFileURL(moduleName)) : moduleName}'` : `${globalName ? "const " + ((named == null ? void 0 : named.trim()) ? `{${named}}` : globalName) + "=" : ""}require('${moduleName.replace(/\\/g, "\\\\")}')`;
	  if (!globalName) {
	    return importStatement;
	  }
	  const overrideStatement = `globalThis.${globalName}=${(named == null ? void 0 : named.trim()) ? named : globalName}`;
	  return importStatement + (conditional === false ? `;${overrideStatement}` : `;if(!globalThis.${globalName})${overrideStatement}`);
	};
	const _generateGlobals = (globalShims, type) => globalShims.reduce(
	  (acc, shim) => `${acc}${acc ? ";" : ""}${encodeImportModule(shim, type)}`,
	  ""
	);
	const globalsCache = /* @__PURE__ */ new Map();
	let tmpdir;
	const _dirname = typeof __dirname === "undefined" ? path.dirname(node_url.fileURLToPath(import_meta.url)) : (
	  /* istanbul ignore next */
	  __dirname
	);
	const generateGlobals = (workerPath, globalShims, type = "import") => {
	  const cached = globalsCache.get(workerPath);
	  if (cached) {
	    const [content2, filepath2] = cached;
	    if (type === "require" && !filepath2 || type === "import" && filepath2 && isFile(filepath2)) {
	      return content2;
	    }
	  }
	  const globals = _generateGlobals(globalShims, type);
	  let content = globals;
	  let filepath;
	  if (type === "import") {
	    if (!tmpdir) {
	      tmpdir = path.resolve(core.findUp(_dirname), "../node_modules/.synckit");
	    }
	    fs.mkdirSync(tmpdir, { recursive: true });
	    filepath = path.resolve(tmpdir, md5Hash(workerPath) + ".mjs");
	    content = encodeImportModule(filepath);
	    fs.writeFileSync(filepath, globals);
	  }
	  globalsCache.set(workerPath, [content, filepath]);
	  return content;
	};
	function startWorkerThread(workerPath, {
	  bufferSize = DEFAULT_WORKER_BUFFER_SIZE,
	  timeout = DEFAULT_TIMEOUT,
	  execArgv = DEFAULT_EXEC_ARGV,
	  tsRunner = DEFAULT_TS_RUNNER,
	  transferList = [],
	  globalShims = DEFAULT_GLOBAL_SHIMS
	} = {}) {
	  const { port1: mainPort, port2: workerPort } = new node_worker_threads.MessageChannel();
	  const {
	    isTs,
	    ext,
	    jsUseEsm,
	    tsUseEsm,
	    tsRunner: finalTsRunner,
	    workerPath: finalWorkerPath,
	    execArgv: finalExecArgv
	  } = setupTsRunner(workerPath, { execArgv, tsRunner });
	  const workerPathUrl = node_url.pathToFileURL(finalWorkerPath);
	  if (/\.[cm]ts$/.test(finalWorkerPath)) {
	    const isTsxSupported = !tsUseEsm || Number.parseFloat(process.versions.node) >= MTS_SUPPORTED_NODE_VERSION;
	    if (!finalTsRunner) {
	      throw new Error("No ts runner specified, ts worker path is not supported");
	    } else if ([
	      // https://github.com/egoist/esbuild-register/issues/79
	      TsRunner.EsbuildRegister,
	      // https://github.com/folke/esbuild-runner/issues/67
	      TsRunner.EsbuildRunner,
	      // https://github.com/swc-project/swc-node/issues/667
	      TsRunner.SWC,
	      .../* istanbul ignore next */
	      isTsxSupported ? [] : [TsRunner.TSX]
	    ].includes(finalTsRunner)) {
	      throw new Error(
	        `${finalTsRunner} is not supported for ${ext} files yet` + /* istanbul ignore next */
	        (isTsxSupported ? ", you can try [tsx](https://github.com/esbuild-kit/tsx) instead" : "")
	      );
	    }
	  }
	  const finalGlobalShims = (globalShims === true ? DEFAULT_GLOBAL_SHIMS_PRESET : Array.isArray(globalShims) ? globalShims : []).filter(({ moduleName }) => core.isPkgAvailable(moduleName));
	  const useGlobals = finalGlobalShims.length > 0;
	  const useEval = isTs ? !tsUseEsm : !jsUseEsm && useGlobals;
	  const worker = new node_worker_threads.Worker(
	    jsUseEsm && useGlobals || tsUseEsm && finalTsRunner === TsRunner.TsNode ? dataUrl(
	      `${generateGlobals(
	        finalWorkerPath,
	        finalGlobalShims
	      )};import '${String(workerPathUrl)}'`
	    ) : useEval ? `${generateGlobals(
	      finalWorkerPath,
	      finalGlobalShims,
	      "require"
	    )};${encodeImportModule(finalWorkerPath, "require")}` : workerPathUrl,
	    {
	      eval: useEval,
	      workerData: { workerPort },
	      transferList: [workerPort, ...transferList],
	      execArgv: finalExecArgv
	    }
	  );
	  let nextID = 0;
	  const syncFn = (...args) => {
	    const id = nextID++;
	    const sharedBuffer = new SharedArrayBuffer(bufferSize);
	    const sharedBufferView = new Int32Array(sharedBuffer);
	    const msg = { sharedBuffer, id, args };
	    worker.postMessage(msg);
	    const status = Atomics.wait(sharedBufferView, 0, 0, timeout);
	    if (!["ok", "not-equal"].includes(status)) {
	      throw new Error("Internal error: Atomics.wait() failed: " + status);
	    }
	    const {
	      id: id2,
	      result,
	      error,
	      properties
	    } = node_worker_threads.receiveMessageOnPort(mainPort).message;
	    if (id !== id2) {
	      throw new Error(`Internal error: Expected id ${id} but got id ${id2}`);
	    }
	    if (error) {
	      throw Object.assign(error, properties);
	    }
	    return result;
	  };
	  worker.unref();
	  return syncFn;
	}
	function runAsWorker(fn) {
	  if (!node_worker_threads.workerData) {
	    return;
	  }
	  const { workerPort } = node_worker_threads.workerData;
	  node_worker_threads.parentPort.on(
	    "message",
	    ({ sharedBuffer, id, args }) => {
	      (() => __async(this, null, function* () {
	        const sharedBufferView = new Int32Array(sharedBuffer);
	        let msg;
	        try {
	          msg = { id, result: yield fn(...args) };
	        } catch (error) {
	          msg = { id, error, properties: extractProperties(error) };
	        }
	        workerPort.postMessage(msg);
	        Atomics.add(sharedBufferView, 0, 1);
	        Atomics.notify(sharedBufferView, 0);
	      }))();
	    }
	  );
	}

	lib$1.DEFAULT_BUFFER_SIZE = DEFAULT_BUFFER_SIZE;
	lib$1.DEFAULT_EXEC_ARGV = DEFAULT_EXEC_ARGV;
	lib$1.DEFAULT_GLOBAL_SHIMS = DEFAULT_GLOBAL_SHIMS;
	lib$1.DEFAULT_GLOBAL_SHIMS_PRESET = DEFAULT_GLOBAL_SHIMS_PRESET;
	lib$1.DEFAULT_TIMEOUT = DEFAULT_TIMEOUT;
	lib$1.DEFAULT_TS_RUNNER = DEFAULT_TS_RUNNER;
	lib$1.DEFAULT_WORKER_BUFFER_SIZE = DEFAULT_WORKER_BUFFER_SIZE;
	lib$1.MTS_SUPPORTED_NODE_VERSION = MTS_SUPPORTED_NODE_VERSION;
	lib$1.TsRunner = TsRunner;
	lib$1._generateGlobals = _generateGlobals;
	lib$1.createSyncFn = createSyncFn;
	lib$1.encodeImportModule = encodeImportModule;
	lib$1.extractProperties = extractProperties;
	lib$1.generateGlobals = generateGlobals;
	lib$1.isFile = isFile;
	lib$1.runAsWorker = runAsWorker;
	return lib$1;
}

/**
 * @file Runs `prettier` as an ESLint rule.
 * @author Andres Suarez
 */

// ------------------------------------------------------------------------------
//  Requirements
// ------------------------------------------------------------------------------

const {
  showInvisibles,
  generateDifferences,
} = prettierLinterHelpers;
const { name, version } = require$$1;

// ------------------------------------------------------------------------------
//  Constants
// ------------------------------------------------------------------------------

const { INSERT, DELETE, REPLACE } = generateDifferences;

// ------------------------------------------------------------------------------
//  Privates
// ------------------------------------------------------------------------------

// Lazily-loaded Prettier.
/**
 * @type {(source: string, options: Options, fileInfoOptions: FileInfoOptions) => string}
 */
let prettierFormat;

// ------------------------------------------------------------------------------
//  Rule Definition
// ------------------------------------------------------------------------------

/**
 * Reports a difference.
 *
 * @param {import('eslint').Rule.RuleContext} context - The ESLint rule context.
 * @param {import('prettier-linter-helpers').Difference} difference - The difference object.
 * @returns {void}
 */
function reportDifference(context, difference) {
  const { operation, offset, deleteText = '', insertText = '' } = difference;
  const range = /** @type {Range} */ ([offset, offset + deleteText.length]);
  // `context.getSourceCode()` was deprecated in ESLint v8.40.0 and replaced
  // with the `sourceCode` property.
  // TODO: Only use property when our eslint peerDependency is >=8.40.0.
  const [start, end] = range.map(index =>
    (context.sourceCode ?? context.getSourceCode()).getLocFromIndex(index),
  );

  context.report({
    messageId: operation,
    data: {
      deleteText: showInvisibles(deleteText),
      insertText: showInvisibles(insertText),
    },
    loc: { start, end },
    fix: fixer => fixer.replaceTextRange(range, insertText),
  });
}

// ------------------------------------------------------------------------------
//  Module Definition
// ------------------------------------------------------------------------------

/**
 * @type {Plugin}
 */
const eslintPluginPrettier$1 = {
  meta: { name, version },
  configs: {
    recommended: {
      extends: ['prettier'],
      plugins: ['prettier'],
      rules: {
        'prettier/prettier': 'error',
        'arrow-body-style': 'off',
        'prefer-arrow-callback': 'off',
      },
    },
  },
  rules: {
    prettier: {
      meta: {
        docs: {
          url: 'https://github.com/prettier/eslint-plugin-prettier#options',
        },
        type: 'layout',
        fixable: 'code',
        schema: [
          // Prettier options:
          {
            type: 'object',
            properties: {},
            additionalProperties: true,
          },
          {
            type: 'object',
            properties: {
              usePrettierrc: { type: 'boolean' },
              fileInfoOptions: {
                type: 'object',
                properties: {},
                additionalProperties: true,
              },
            },
            additionalProperties: true,
          },
        ],
        messages: {
          [INSERT]: 'Insert `{{ insertText }}`',
          [DELETE]: 'Delete `{{ deleteText }}`',
          [REPLACE]: 'Replace `{{ deleteText }}` with `{{ insertText }}`',
        },
      },
      create(context) {
        const usePrettierrc =
          !context.options[1] || context.options[1].usePrettierrc !== false;
        /**
         * @type {FileInfoOptions}
         */
        const fileInfoOptions =
          (context.options[1] && context.options[1].fileInfoOptions) || {};

        // `context.getSourceCode()` was deprecated in ESLint v8.40.0 and replaced
        // with the `sourceCode` property.
        // TODO: Only use property when our eslint peerDependency is >=8.40.0.
        const sourceCode = context.sourceCode ?? context.getSourceCode();
        // `context.getFilename()` was deprecated in ESLint v8.40.0 and replaced
        // with the `filename` property.
        // TODO: Only use property when our eslint peerDependency is >=8.40.0.
        const filepath = context.filename ?? context.getFilename();

        // Processors that extract content from a file, such as the markdown
        // plugin extracting fenced code blocks may choose to specify virtual
        // file paths. If this is the case then we need to resolve prettier
        // config and file info using the on-disk path instead of the virtual
        // path.
        // `context.getPhysicalFilename()` was deprecated in ESLint v8.40.0 and replaced
        // with the `physicalFilename` property.
        // TODO: Only use property when our eslint peerDependency is >=8.40.0.
        const onDiskFilepath =
          context.physicalFilename ?? context.getPhysicalFilename();
        const source = sourceCode.text;

        return {
          Program() {
            if (!prettierFormat) {
              // Prettier is expensive to load, so only load it if needed.
              prettierFormat = requireLib().createSyncFn(
                require.resolve('./worker'),
              );
            }

            /**
             * @type {PrettierOptions}
             */
            const eslintPrettierOptions = context.options[0] || {};

            const parser = context.languageOptions?.parser;

            // prettier.format() may throw a SyntaxError if it cannot parse the
            // source code it is given. Usually for JS files this isn't a
            // problem as ESLint will report invalid syntax before trying to
            // pass it to the prettier plugin. However this might be a problem
            // for non-JS languages that are handled by a plugin. Notably Vue
            // files throw an error if they contain unclosed elements, such as
            // `<template><div></template>. In this case report an error at the
            // point at which parsing failed.
            /**
             * @type {string}
             */
            let prettierSource;
            try {
              prettierSource = prettierFormat(
                source,
                {
                  ...eslintPrettierOptions,
                  filepath,
                  onDiskFilepath,
                  parserMeta:
                    parser &&
                    (parser.meta ?? {
                      name: parser.name,
                      version: parser.version,
                    }),
                  parserPath: context.parserPath,
                  usePrettierrc,
                },
                fileInfoOptions,
              );
            } catch (err) {
              if (!(err instanceof SyntaxError)) {
                throw err;
              }

              let message = 'Parsing error: ' + err.message;

              const error =
                /** @type {SyntaxError & {codeFrame: string; loc: SourceLocation}} */ (
                  err
                );

              // Prettier's message contains a codeframe style preview of the
              // invalid code and the line/column at which the error occurred.
              // ESLint shows those pieces of information elsewhere already so
              // remove them from the message
              if (error.codeFrame) {
                message = message.replace(`\n${error.codeFrame}`, '');
              }
              if (error.loc) {
                message = message.replace(/ \(\d+:\d+\)$/, '');
              }

              context.report({ message, loc: error.loc });

              return;
            }

            if (prettierSource == null) {
              return;
            }

            if (source !== prettierSource) {
              const differences = generateDifferences(source, prettierSource);

              for (const difference of differences) {
                reportDifference(context, difference);
              }
            }
          },
        };
      },
    },
  },
};

var eslintPluginPrettier_1 = eslintPluginPrettier$1;

const eslintConfigPrettier = require$$0$2;
const eslintPluginPrettier = eslintPluginPrettier_1;

// Merge the contents of eslint-config-prettier into every
var recommended = {
  ...eslintConfigPrettier,
  plugins: {
    ...eslintConfigPrettier.plugins,
    prettier: eslintPluginPrettier,
  },
  rules: {
    ...eslintConfigPrettier.rules,
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
  },
};

var prettierPlugin = /*@__PURE__*/getDefaultExportFromCjs(recommended);

var eslint_config = [
  {
    ...love,
    files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
    rules: {
      "@typescript-eslint/no-invalid-void-type": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/return-await": "off",
      "prefer-promise-reject-errors": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
          prefix: ["I"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
          prefix: ["T"],
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "lodash",
              message:
                "Please import 'nameFunc' from 'lodash/nameFunc' instead of lodash",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ["node_modules/*", "build/*", "dist/*", "eslint.config.js"],
  },
  prettierPlugin,
];

module.exports = eslint_config;
