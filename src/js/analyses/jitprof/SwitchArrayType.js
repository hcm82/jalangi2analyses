/*
 * Copyright 2014 University of California, Berkeley.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Liang Gong
// Ported to Jalangi2 by Koushik Sen
// Michael Pradel (michael@binaervarianz.de)


/**
 * Check Rule: Try not to put non-numeric values into numeric arrays
 * This checker detects assigning non-numeric values into numeric arrays
 *
 * Assigning non-numeric values into numeric arrays leads to array's inner data
 * structure transition to accommodate the new element type.
 * The transition is very expansive.
 *
 * This analysis monitors put field operation to detect this inefficient operation.
 *
 */

((function (sandbox) {
    function SwitchArrayType() {
        var Constants = sandbox.Constants;
        var HOP = Constants.HOP;
        var iidToLocation = sandbox.iidToLocation;
        var sort = Array.prototype.sort;

        var RuntimeDB = sandbox.RuntimeDB;
        var db = new RuntimeDB();
        var Utils = sandbox.Utils;
        var Warning = sandbox.WarningSummary.Warning;

        var warning_limit = 30;

        // ---- JIT library functions start ----

        function checkIfArrayIsNumeric(base, val, iid) {
            // attach a meta data 'numeric' or 'non-numeric' to this array
            // if the meta data does not exist, check the type of this array
            var shadow = sandbox.getShadowObject(base);
            if (shadow && shadow.arrType === undefined) {
                var all_undefined = true;
                shadow.arrType = 'unknown';
                inner:
                    for (var i = 0; i < base.length; i++) {
                        if (typeof base[i] !== 'undefined') {
                            all_undefined = false;
                        }
                        if (typeof base[i] !== 'number' && typeof base[i] !== 'undefined') {
                            shadow.arrType = 'non-numeric';
                            all_undefined = false;
                            break inner;
                        }
                        //console.log(JSON.stringify(base));
                        shadow.arrType = 'numeric';
                    }
                if (all_undefined) {
                    shadow.arrType = 'unknown';
                }
            }

            // for now this code does not check switching from non-numeric array to numeric, as it might be expensive
            if (shadow && shadow.arrType === 'numeric') {
                if (typeof val !== 'number' && typeof val !== 'undefined') {
                    db.addCountByIndexArr(['JIT-checker', 'arr-type-switch', iid]);
                    shadow.arrType = 'non-numeric';
                }
            }

            if (shadow && shadow.arrType === 'unknown') {
                if (typeof val === 'number') {
                    shadow.arrType = 'numeric';
                } else if (typeof val === 'undefined') {
                    // do nothing, type remain unknown
                } else {
                    shadow.arrType = 'non-numeric';
                }
            }
        }

        // ---- JIT library functions end ----

        this.putFieldPre = function (iid, base, offset, val) {
            if (base !== null && base !== undefined) {
                if (Utils.isArr(base) && Utils.isNormalNumber(offset)) {
                    checkIfArrayIsNumeric(base, val, sandbox.getGlobalIID(iid));
                }
            }
        };

        this.endExecution = function () {
            this.printResult();
        };


        this.printResult = function () {
            try {
                sandbox.log("---------------------------");
                sandbox.log('Report of switching array type');
                var switchArrTypeArr = [];
                var switchArrTypeDB = db.getByIndexArr(['JIT-checker', 'arr-type-switch']);
                var num = 0;
                for (var prop in switchArrTypeDB) {
                    if (HOP(switchArrTypeDB, prop)) {
                        switchArrTypeArr.push({'iid': prop, 'count': switchArrTypeDB[prop].count});
                        num++;
                    }
                }
                switchArrTypeArr.sort(function compare(a, b) {
                    return b.count - a.count;
                });
                var warnings = [];
                for (var i = 0; i < switchArrTypeArr.length && i < warning_limit; i++) {
                    var warningEntry = switchArrTypeArr[i];
                    sandbox.log(' * [location: ' + iidToLocation(warningEntry.iid) + ']: <br/> &nbsp; Number of usages: ' + warningEntry.count);
                    var warning = new Warning("SwitchArrayType", warningEntry.iid, iidToLocation(warningEntry.iid), "Switching array type", warningEntry.count);
                    warnings.push(warning);
                }
                sandbox.WarningSummary.addWarnings(warnings);
                sandbox.log('...');
                sandbox.log('<b>Number of switching array type spotted: ' + num + '</b>');
                sandbox.log('[****]SwitchArrayType: ' + num);


            } catch (e) {
                console.log("error!!");
                console.log(e);
            }
        }
    }

    sandbox.analysis = new SwitchArrayType();

})(J$));

