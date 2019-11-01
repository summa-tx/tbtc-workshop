pragma solidity ^0.5.10;

import {ValidateSPV} from "@summa-tx/bitcoin-spv-sol/contracts/ValidateSPV.sol";
import {BytesLib} from "@summa-tx/bitcoin-spv-sol/contracts/BytesLib.sol";
import {BTCUtils} from "@summa-tx/bitcoin-spv-sol/contracts/BTCUtils.sol";

contract SPVLogger {

    event JamesPaid(bytes32 txid);
    event WhyJamesNotPaid(bytes32 txid, uint8 errorCode);


    // tb1q2fzplpnegt0txkql5rw8j4nzce7wmdv54rgj45
    bytes public constant JAMES_HASH = hex"52441f867942deb3581fa0dc795662c67cedb594";

    uint8 public constant ERR_BAD_PROOF = 1;
    uint8 public constant ERR_BAD_VIN = 2;
    uint8 public constant ERR_BAD_VOUT = 3;
    uint8 public constant ERR_MUST_PAY_JAMES_MORE = 254;
    uint8 public constant ERR_DOES_NOT_PAY_JAMES = 255;

    function paysJames(
            bytes calldata _header,  // a bitcoin block header
            bytes calldata _merkleProof,  // a merkle inclusion proof
            bytes4 _version,  // the bitcoin tx version
            bytes4 _locktime,  // the bitcoin tx timelock field
            uint256 _indexInBlock,  // the position of the transaction in its block
            uint8 _paysJamesIndex,  // the index of the output that PAYS JAMES :D
            bytes calldata _vin,  // the bitcoin transaction input vector
            bytes calldata _vout  // the bitcoin transaction output vector
    ) external returns (bool) {
        bytes32 _txid = BTCUtils.hash256(abi.encodePacked(_version, _vin, _vout, _locktime));

        bool _included = _checkInclusion(
            _header,
            _merkleProof,
            _indexInBlock,
            _txid);

        if (!_included) {
            emit WhyJamesNotPaid(_txid, ERR_BAD_PROOF);
            return false;
        }

        // Goal: use BTCUtils to validate the _vin
        bool _validVin = BTCUtils.validateVin(_vin);
        if (!_validVin) {
            emit WhyJamesNotPaid(_txid, ERR_BAD_VIN);
            return false;
        }

        // Goal: use BTCUtils to validate the _vout
        bool _validVout = BTCUtils.validateVout(_vout);
        if (!_validVout) {
            emit WhyJamesNotPaid(_txid, ERR_BAD_VOUT);
            return false;
        }

        // Goal: use BTCUtils to extract the output that PAYS JAMES from the vin
        bytes memory _output = BTCUtils.extractOutputAtIndex(_vout, _paysJamesIndex);

        bool _shouldPayJames = _paysJames(_output);
        if (!_shouldPayJames) {
            emit WhyJamesNotPaid(_txid, ERR_DOES_NOT_PAY_JAMES);
            return false;
        }

        uint64 _payJamesSatoshis = _howMuchPayJames(_output);
        if (_payJamesSatoshis < 100000) {
            emit WhyJamesNotPaid(_txid, ERR_MUST_PAY_JAMES_MORE);
            return false;
        }

        emit JamesPaid(_txid);
        return true;
    }

    function _checkInclusion(
        bytes memory _header,
        bytes memory _merkleProof,
        uint256 _indexInBlock,
        bytes32 _txid
    ) internal pure returns (bool) {
        // Goal: check transaction inclusion in the header

        // You'll need to extract the merkle root from the header
        // Use BTCUtils to extract it, and BytesLib to make it a bytes32
        // Then use ValidateSPV to check the proof

        bytes memory _root = BTCUtils.extractMerkleRootLE(_header);
        bytes32 _merkleRoot = BytesLib.toBytes32(_root);

        return ValidateSPV.prove(
            _txid,
            _merkleRoot,
            _merkleProof,
            _indexInBlock);
    }

    function _paysJames(
        bytes memory _output
    ) internal pure returns (bool) {
        // Goal: Check that it pays James :)
        //
        // 2 steps:
        // 1. check that it is a witness PKH output
        // 2. Check that the output hash is equal to the JAMES_HASH variable
        //
        // Hint: Solidity doesn't do equality between bytes
        // Use keccak256 to make bytes32 from bytes

        if (keccak256(BytesLib.slice(_output, 8, 3)) != keccak256(hex"160014")) {
            return false;
        }

        bytes memory _whoItPays = BTCUtils.extractHash(_output);
        return keccak256(_whoItPays) == keccak256(JAMES_HASH);
    }

    function _howMuchPayJames(
        bytes memory _output
    ) internal pure returns (uint64) {
        // Goal: Extract the value from the output
        //
        // Hint: BTCUtils makes this easy
        return BTCUtils.extractValue(_output);
    }
}
