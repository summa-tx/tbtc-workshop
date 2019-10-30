pragma solidity ^0.5.10;

import {ValidateSPV} from "@summa-tx/bitcoin-spv-sol/contracts/ValidateSPV.sol";
import {BytesLib} from "@summa-tx/bitcoin-spv-sol/contracts/BytesLib.sol";
import {BTCUtils} from "@summa-tx/bitcoin-spv-sol/contracts/BTCUtils.sol";

contract SPVLogger {

    event JamesPaid(bytes32 txid);
    event WhyJamesNotPaid(bytes32 txid, uint8 errorCode);

    bytes public constant PAY_JAMES = hex"";

    uint8 public constant ERR_BAD_PROOF = 1;
    uint8 public constant ERR_BAD_VIN = 2;
    uint8 public constant ERR_BAD_VOUT = 3;
    uint8 public constant ERR_PAY_JAMES_MORE = 254;
    uint8 public constant ERR_DOES_NOT_PAY_JAMES = 255;

    function paysJames(
            bytes4 _version,
            bytes calldata _vin,
            bytes calldata _vout,
            bytes4 _locktime,
            bytes calldata _header,
            bytes calldata _merkleProof,
            uint256 _indexInBlock,
            uint8 _paysJamesIndex
    ) external pure returns (bool) {
        bytes _tx = abi.encodePacked(_version, _vin, _vout, _locktime);
        bytes32 _txid = BTCUtils.hash256(_tx);

        bool _included = _checkInclusion(
            _header,
            _merkleProof,
            _indexInBlock,
            _txid);

        if (!_included) {
            emit WhyJamesNotPaid(_txid, ERR_BAD_PROOF);
            return false;
        }

        if (!BTCUtils.validateVin(_vin)) {
            emit WhyJamesNotPaid(_txid, ERR_BAD_VIN);
            return false;
        }

        if (!BTCUtils.validateVout(_vout)) {
            emit WhyJamesNotPaid(_txid, ERR_BAD_VOUT);
            return false;
        }

        bytes memory _output = BTCUtils.extractOutputAtIndex(_paysJamesIndex);

        bool _paysJames =

        if (!_paysJames) {
            emit WhyJamesNotPaid(_txid, ERR_DOES_NOT_PAY_JAMES);
            return false;
        }

        uint64 _payJamesSatoshis = _howMuchPayJames(_output);

        if (_payJamesSatoshis < 100000) {
            emit WhyJamesNotPaid(_txid, ERR_PAY_JAMES_MORE);
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
        return ValidateSPV.prove(
            _txid,
            _header.extractMerkleRootLE().toBytes32(),
            _merkleProof,
            _indexInBlock);
    }

    function _paysJames(
        bytes memory _output
    ) internal pure returns (bool) {
        bytes _whoItPays = BTCUtils.extractPayload(_output);

        return keccak256(_whoItPays) == keccak256(PAY_JAMES);
    }

    function _howMuchPayJames(
        bytes memory _output
    ) internal pure returns (uint64) {

    }
}
