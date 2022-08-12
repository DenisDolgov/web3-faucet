// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

abstract contract Logger {
    function emitLog() public pure virtual returns(bytes32);
}
