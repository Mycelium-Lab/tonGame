import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type LogEventMintRecord = {
    $$type: 'LogEventMintRecord';
    minter: Address;
    item_id: bigint;
    generate_number: bigint;
}

export function storeLogEventMintRecord(src: LogEventMintRecord) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2743565669, 32);
        b_0.storeAddress(src.minter);
        b_0.storeInt(src.item_id, 257);
        b_0.storeInt(src.generate_number, 257);
    };
}

export function loadLogEventMintRecord(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2743565669) { throw Error('Invalid prefix'); }
    let _minter = sc_0.loadAddress();
    let _item_id = sc_0.loadIntBig(257);
    let _generate_number = sc_0.loadIntBig(257);
    return { $$type: 'LogEventMintRecord' as const, minter: _minter, item_id: _item_id, generate_number: _generate_number };
}

function loadTupleLogEventMintRecord(source: TupleReader) {
    let _minter = source.readAddress();
    let _item_id = source.readBigNumber();
    let _generate_number = source.readBigNumber();
    return { $$type: 'LogEventMintRecord' as const, minter: _minter, item_id: _item_id, generate_number: _generate_number };
}

function storeTupleLogEventMintRecord(source: LogEventMintRecord) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.minter);
    builder.writeNumber(source.item_id);
    builder.writeNumber(source.generate_number);
    return builder.build();
}

function dictValueParserLogEventMintRecord(): DictionaryValue<LogEventMintRecord> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeLogEventMintRecord(src)).endCell());
        },
        parse: (src) => {
            return loadLogEventMintRecord(src.loadRef().beginParse());
        }
    }
}

export type GetRoyaltyParams = {
    $$type: 'GetRoyaltyParams';
    query_id: bigint;
}

export function storeGetRoyaltyParams(src: GetRoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1765620048, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1765620048) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function loadTupleGetRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetRoyaltyParams' as const, query_id: _query_id };
}

function storeTupleGetRoyaltyParams(source: GetRoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGetRoyaltyParams(): DictionaryValue<GetRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadGetRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type ReportRoyaltyParams = {
    $$type: 'ReportRoyaltyParams';
    query_id: bigint;
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeReportRoyaltyParams(src: ReportRoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2831876269, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeUint(src.numerator, 16);
        b_0.storeUint(src.denominator, 16);
        b_0.storeAddress(src.destination);
    };
}

export function loadReportRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2831876269) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _numerator = sc_0.loadUintBig(16);
    let _denominator = sc_0.loadUintBig(16);
    let _destination = sc_0.loadAddress();
    return { $$type: 'ReportRoyaltyParams' as const, query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadTupleReportRoyaltyParams(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'ReportRoyaltyParams' as const, query_id: _query_id, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function storeTupleReportRoyaltyParams(source: ReportRoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

function dictValueParserReportRoyaltyParams(): DictionaryValue<ReportRoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadReportRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type CollectionData = {
    $$type: 'CollectionData';
    next_item_index: bigint;
    collection_content: Cell;
    owner_address: Address;
}

export function storeCollectionData(src: CollectionData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.next_item_index, 257);
        b_0.storeRef(src.collection_content);
        b_0.storeAddress(src.owner_address);
    };
}

export function loadCollectionData(slice: Slice) {
    let sc_0 = slice;
    let _next_item_index = sc_0.loadIntBig(257);
    let _collection_content = sc_0.loadRef();
    let _owner_address = sc_0.loadAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function loadTupleCollectionData(source: TupleReader) {
    let _next_item_index = source.readBigNumber();
    let _collection_content = source.readCell();
    let _owner_address = source.readAddress();
    return { $$type: 'CollectionData' as const, next_item_index: _next_item_index, collection_content: _collection_content, owner_address: _owner_address };
}

function storeTupleCollectionData(source: CollectionData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.next_item_index);
    builder.writeCell(source.collection_content);
    builder.writeAddress(source.owner_address);
    return builder.build();
}

function dictValueParserCollectionData(): DictionaryValue<CollectionData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeCollectionData(src)).endCell());
        },
        parse: (src) => {
            return loadCollectionData(src.loadRef().beginParse());
        }
    }
}

export type RoyaltyParams = {
    $$type: 'RoyaltyParams';
    numerator: bigint;
    denominator: bigint;
    destination: Address;
}

export function storeRoyaltyParams(src: RoyaltyParams) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeInt(src.numerator, 257);
        b_0.storeInt(src.denominator, 257);
        b_0.storeAddress(src.destination);
    };
}

export function loadRoyaltyParams(slice: Slice) {
    let sc_0 = slice;
    let _numerator = sc_0.loadIntBig(257);
    let _denominator = sc_0.loadIntBig(257);
    let _destination = sc_0.loadAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function loadTupleRoyaltyParams(source: TupleReader) {
    let _numerator = source.readBigNumber();
    let _denominator = source.readBigNumber();
    let _destination = source.readAddress();
    return { $$type: 'RoyaltyParams' as const, numerator: _numerator, denominator: _denominator, destination: _destination };
}

function storeTupleRoyaltyParams(source: RoyaltyParams) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.numerator);
    builder.writeNumber(source.denominator);
    builder.writeAddress(source.destination);
    return builder.build();
}

function dictValueParserRoyaltyParams(): DictionaryValue<RoyaltyParams> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeRoyaltyParams(src)).endCell());
        },
        parse: (src) => {
            return loadRoyaltyParams(src.loadRef().beginParse());
        }
    }
}

export type Transfer = {
    $$type: 'Transfer';
    query_id: bigint;
    new_owner: Address;
    response_destination: Address | null;
    custom_payload: Cell | null;
    forward_amount: bigint;
    forward_payload: Slice;
}

export function storeTransfer(src: Transfer) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1607220500, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.new_owner);
        b_0.storeAddress(src.response_destination);
        if (src.custom_payload !== null && src.custom_payload !== undefined) { b_0.storeBit(true).storeRef(src.custom_payload); } else { b_0.storeBit(false); }
        b_0.storeCoins(src.forward_amount);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadTransfer(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1607220500) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _new_owner = sc_0.loadAddress();
    let _response_destination = sc_0.loadMaybeAddress();
    let _custom_payload = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _forward_amount = sc_0.loadCoins();
    let _forward_payload = sc_0;
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function loadTupleTransfer(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _new_owner = source.readAddress();
    let _response_destination = source.readAddressOpt();
    let _custom_payload = source.readCellOpt();
    let _forward_amount = source.readBigNumber();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'Transfer' as const, query_id: _query_id, new_owner: _new_owner, response_destination: _response_destination, custom_payload: _custom_payload, forward_amount: _forward_amount, forward_payload: _forward_payload };
}

function storeTupleTransfer(source: Transfer) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.new_owner);
    builder.writeAddress(source.response_destination);
    builder.writeCell(source.custom_payload);
    builder.writeNumber(source.forward_amount);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserTransfer(): DictionaryValue<Transfer> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeTransfer(src)).endCell());
        },
        parse: (src) => {
            return loadTransfer(src.loadRef().beginParse());
        }
    }
}

export type OwnershipAssigned = {
    $$type: 'OwnershipAssigned';
    query_id: bigint;
    prev_owner: Address;
    forward_payload: Slice;
}

export function storeOwnershipAssigned(src: OwnershipAssigned) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(85167505, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeAddress(src.prev_owner);
        b_0.storeBuilder(src.forward_payload.asBuilder());
    };
}

export function loadOwnershipAssigned(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 85167505) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _prev_owner = sc_0.loadAddress();
    let _forward_payload = sc_0;
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

function loadTupleOwnershipAssigned(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _prev_owner = source.readAddress();
    let _forward_payload = source.readCell().asSlice();
    return { $$type: 'OwnershipAssigned' as const, query_id: _query_id, prev_owner: _prev_owner, forward_payload: _forward_payload };
}

function storeTupleOwnershipAssigned(source: OwnershipAssigned) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeAddress(source.prev_owner);
    builder.writeSlice(source.forward_payload.asCell());
    return builder.build();
}

function dictValueParserOwnershipAssigned(): DictionaryValue<OwnershipAssigned> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeOwnershipAssigned(src)).endCell());
        },
        parse: (src) => {
            return loadOwnershipAssigned(src.loadRef().beginParse());
        }
    }
}

export type Excesses = {
    $$type: 'Excesses';
    query_id: bigint;
}

export function storeExcesses(src: Excesses) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3576854235, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadExcesses(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3576854235) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function loadTupleExcesses(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'Excesses' as const, query_id: _query_id };
}

function storeTupleExcesses(source: Excesses) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserExcesses(): DictionaryValue<Excesses> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeExcesses(src)).endCell());
        },
        parse: (src) => {
            return loadExcesses(src.loadRef().beginParse());
        }
    }
}

export type GetStaticData = {
    $$type: 'GetStaticData';
    query_id: bigint;
}

export function storeGetStaticData(src: GetStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(801842850, 32);
        b_0.storeUint(src.query_id, 64);
    };
}

export function loadGetStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 801842850) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function loadTupleGetStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    return { $$type: 'GetStaticData' as const, query_id: _query_id };
}

function storeTupleGetStaticData(source: GetStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    return builder.build();
}

function dictValueParserGetStaticData(): DictionaryValue<GetStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadGetStaticData(src.loadRef().beginParse());
        }
    }
}

export type ReportStaticData = {
    $$type: 'ReportStaticData';
    query_id: bigint;
    index_id: bigint;
    collection: Address;
}

export function storeReportStaticData(src: ReportStaticData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2339837749, 32);
        b_0.storeUint(src.query_id, 64);
        b_0.storeInt(src.index_id, 257);
        b_0.storeAddress(src.collection);
    };
}

export function loadReportStaticData(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2339837749) { throw Error('Invalid prefix'); }
    let _query_id = sc_0.loadUintBig(64);
    let _index_id = sc_0.loadIntBig(257);
    let _collection = sc_0.loadAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function loadTupleReportStaticData(source: TupleReader) {
    let _query_id = source.readBigNumber();
    let _index_id = source.readBigNumber();
    let _collection = source.readAddress();
    return { $$type: 'ReportStaticData' as const, query_id: _query_id, index_id: _index_id, collection: _collection };
}

function storeTupleReportStaticData(source: ReportStaticData) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.query_id);
    builder.writeNumber(source.index_id);
    builder.writeAddress(source.collection);
    return builder.build();
}

function dictValueParserReportStaticData(): DictionaryValue<ReportStaticData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeReportStaticData(src)).endCell());
        },
        parse: (src) => {
            return loadReportStaticData(src.loadRef().beginParse());
        }
    }
}

export type GetNftData = {
    $$type: 'GetNftData';
    is_initialized: boolean;
    index: bigint;
    collection_address: Address;
    owner_address: Address;
    individual_content: Cell;
}

export function storeGetNftData(src: GetNftData) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.is_initialized);
        b_0.storeInt(src.index, 257);
        b_0.storeAddress(src.collection_address);
        b_0.storeAddress(src.owner_address);
        b_0.storeRef(src.individual_content);
    };
}

export function loadGetNftData(slice: Slice) {
    let sc_0 = slice;
    let _is_initialized = sc_0.loadBit();
    let _index = sc_0.loadIntBig(257);
    let _collection_address = sc_0.loadAddress();
    let _owner_address = sc_0.loadAddress();
    let _individual_content = sc_0.loadRef();
    return { $$type: 'GetNftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}

function loadTupleGetNftData(source: TupleReader) {
    let _is_initialized = source.readBoolean();
    let _index = source.readBigNumber();
    let _collection_address = source.readAddress();
    let _owner_address = source.readAddress();
    let _individual_content = source.readCell();
    return { $$type: 'GetNftData' as const, is_initialized: _is_initialized, index: _index, collection_address: _collection_address, owner_address: _owner_address, individual_content: _individual_content };
}

function storeTupleGetNftData(source: GetNftData) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.is_initialized);
    builder.writeNumber(source.index);
    builder.writeAddress(source.collection_address);
    builder.writeAddress(source.owner_address);
    builder.writeCell(source.individual_content);
    return builder.build();
}

function dictValueParserGetNftData(): DictionaryValue<GetNftData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetNftData(src)).endCell());
        },
        parse: (src) => {
            return loadGetNftData(src.loadRef().beginParse());
        }
    }
}

export type SetAllowedMint = {
    $$type: 'SetAllowedMint';
    minter: Address;
    allowed: boolean;
}

export function storeSetAllowedMint(src: SetAllowedMint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3500333732, 32);
        b_0.storeAddress(src.minter);
        b_0.storeBit(src.allowed);
    };
}

export function loadSetAllowedMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3500333732) { throw Error('Invalid prefix'); }
    let _minter = sc_0.loadAddress();
    let _allowed = sc_0.loadBit();
    return { $$type: 'SetAllowedMint' as const, minter: _minter, allowed: _allowed };
}

function loadTupleSetAllowedMint(source: TupleReader) {
    let _minter = source.readAddress();
    let _allowed = source.readBoolean();
    return { $$type: 'SetAllowedMint' as const, minter: _minter, allowed: _allowed };
}

function storeTupleSetAllowedMint(source: SetAllowedMint) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.minter);
    builder.writeBoolean(source.allowed);
    return builder.build();
}

function dictValueParserSetAllowedMint(): DictionaryValue<SetAllowedMint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetAllowedMint(src)).endCell());
        },
        parse: (src) => {
            return loadSetAllowedMint(src.loadRef().beginParse());
        }
    }
}

export type Mint = {
    $$type: 'Mint';
    recipient: Address;
    type: bigint;
    type_index: bigint;
    data: string;
}

export function storeMint(src: Mint) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2552375875, 32);
        b_0.storeAddress(src.recipient);
        b_0.storeInt(src.type, 257);
        b_0.storeInt(src.type_index, 257);
        b_0.storeStringRefTail(src.data);
    };
}

export function loadMint(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2552375875) { throw Error('Invalid prefix'); }
    let _recipient = sc_0.loadAddress();
    let _type = sc_0.loadIntBig(257);
    let _type_index = sc_0.loadIntBig(257);
    let _data = sc_0.loadStringRefTail();
    return { $$type: 'Mint' as const, recipient: _recipient, type: _type, type_index: _type_index, data: _data };
}

function loadTupleMint(source: TupleReader) {
    let _recipient = source.readAddress();
    let _type = source.readBigNumber();
    let _type_index = source.readBigNumber();
    let _data = source.readString();
    return { $$type: 'Mint' as const, recipient: _recipient, type: _type, type_index: _type_index, data: _data };
}

function storeTupleMint(source: Mint) {
    let builder = new TupleBuilder();
    builder.writeAddress(source.recipient);
    builder.writeNumber(source.type);
    builder.writeNumber(source.type_index);
    builder.writeString(source.data);
    return builder.build();
}

function dictValueParserMint(): DictionaryValue<Mint> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMint(src)).endCell());
        },
        parse: (src) => {
            return loadMint(src.loadRef().beginParse());
        }
    }
}

export type GetItemType = {
    $$type: 'GetItemType';
    type: bigint;
    type_index: bigint;
    type_data: string;
}

export function storeGetItemType(src: GetItemType) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(753362518, 32);
        b_0.storeInt(src.type, 257);
        b_0.storeInt(src.type_index, 257);
        b_0.storeStringRefTail(src.type_data);
    };
}

export function loadGetItemType(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 753362518) { throw Error('Invalid prefix'); }
    let _type = sc_0.loadIntBig(257);
    let _type_index = sc_0.loadIntBig(257);
    let _type_data = sc_0.loadStringRefTail();
    return { $$type: 'GetItemType' as const, type: _type, type_index: _type_index, type_data: _type_data };
}

function loadTupleGetItemType(source: TupleReader) {
    let _type = source.readBigNumber();
    let _type_index = source.readBigNumber();
    let _type_data = source.readString();
    return { $$type: 'GetItemType' as const, type: _type, type_index: _type_index, type_data: _type_data };
}

function storeTupleGetItemType(source: GetItemType) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.type);
    builder.writeNumber(source.type_index);
    builder.writeString(source.type_data);
    return builder.build();
}

function dictValueParserGetItemType(): DictionaryValue<GetItemType> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeGetItemType(src)).endCell());
        },
        parse: (src) => {
            return loadGetItemType(src.loadRef().beginParse());
        }
    }
}

export type SetItemType = {
    $$type: 'SetItemType';
    type: bigint;
    type_index: bigint;
    data: string;
}

export function storeSetItemType(src: SetItemType) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(4119167700, 32);
        b_0.storeInt(src.type, 257);
        b_0.storeInt(src.type_index, 257);
        b_0.storeStringRefTail(src.data);
    };
}

export function loadSetItemType(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 4119167700) { throw Error('Invalid prefix'); }
    let _type = sc_0.loadIntBig(257);
    let _type_index = sc_0.loadIntBig(257);
    let _data = sc_0.loadStringRefTail();
    return { $$type: 'SetItemType' as const, type: _type, type_index: _type_index, data: _data };
}

function loadTupleSetItemType(source: TupleReader) {
    let _type = source.readBigNumber();
    let _type_index = source.readBigNumber();
    let _data = source.readString();
    return { $$type: 'SetItemType' as const, type: _type, type_index: _type_index, data: _data };
}

function storeTupleSetItemType(source: SetItemType) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.type);
    builder.writeNumber(source.type_index);
    builder.writeString(source.data);
    return builder.build();
}

function dictValueParserSetItemType(): DictionaryValue<SetItemType> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSetItemType(src)).endCell());
        },
        parse: (src) => {
            return loadSetItemType(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    let _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function loadTupleFactoryDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    let _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

function storeTupleFactoryDeploy(source: FactoryDeploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

 type NftCollection_init_args = {
    $$type: 'NftCollection_init_args';
    owner_address: Address;
    collection_content: Cell;
    royalty_params: RoyaltyParams;
}

function initNftCollection_init_args(src: NftCollection_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner_address);
        b_0.storeRef(src.collection_content);
        let b_1 = new Builder();
        b_1.store(storeRoyaltyParams(src.royalty_params));
        b_0.storeRef(b_1.endCell());
    };
}

async function NftCollection_init(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams) {
    const __code = Cell.fromBase64('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');
    const __system = Cell.fromBase64('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');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initNftCollection_init_args({ $$type: 'NftCollection_init_args', owner_address, collection_content, royalty_params })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const NftCollection_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack underflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
    14534: { message: `Not owner` },
    22049: { message: `not allowed to mint` },
    27499: { message: `initialized tx need from collection` },
    49280: { message: `not owner` },
    49469: { message: `not from collection` },
    62742: { message: `non-sequential NFTs` },
}

const NftCollection_types: ABIType[] = [
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounced","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}}]},
    {"name":"LogEventMintRecord","header":2743565669,"fields":[{"name":"minter","type":{"kind":"simple","type":"address","optional":false}},{"name":"item_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"generate_number","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"GetRoyaltyParams","header":1765620048,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportRoyaltyParams","header":2831876269,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"numerator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"denominator","type":{"kind":"simple","type":"uint","optional":false,"format":16}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"CollectionData","header":null,"fields":[{"name":"next_item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_content","type":{"kind":"simple","type":"cell","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"RoyaltyParams","header":null,"fields":[{"name":"numerator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"denominator","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"destination","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Transfer","header":1607220500,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"new_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"response_destination","type":{"kind":"simple","type":"address","optional":true}},{"name":"custom_payload","type":{"kind":"simple","type":"cell","optional":true}},{"name":"forward_amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"OwnershipAssigned","header":85167505,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"prev_owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"forward_payload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"Excesses","header":3576854235,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"GetStaticData","header":801842850,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"ReportStaticData","header":2339837749,"fields":[{"name":"query_id","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index_id","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"GetNftData","header":null,"fields":[{"name":"is_initialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"collection_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner_address","type":{"kind":"simple","type":"address","optional":false}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"SetAllowedMint","header":3500333732,"fields":[{"name":"minter","type":{"kind":"simple","type":"address","optional":false}},{"name":"allowed","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"Mint","header":2552375875,"fields":[{"name":"recipient","type":{"kind":"simple","type":"address","optional":false}},{"name":"type","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"type_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"data","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"GetItemType","header":753362518,"fields":[{"name":"type","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"type_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"type_data","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"SetItemType","header":4119167700,"fields":[{"name":"type","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"type_index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"data","type":{"kind":"simple","type":"string","optional":false}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
]

const NftCollection_getters: ABIGetter[] = [
    {"name":"get_collection_data","arguments":[],"returnType":{"kind":"simple","type":"CollectionData","optional":false}},
    {"name":"get_nft_address_by_index","arguments":[{"name":"item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":true}},
    {"name":"getNftItemInit","arguments":[{"name":"item_index","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"StateInit","optional":false}},
    {"name":"get_nft_content","arguments":[{"name":"index","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"individual_content","type":{"kind":"simple","type":"cell","optional":false}}],"returnType":{"kind":"simple","type":"cell","optional":false}},
    {"name":"royalty_params","arguments":[],"returnType":{"kind":"simple","type":"RoyaltyParams","optional":false}},
]

export const NftCollection_getterMapping: { [key: string]: string } = {
    'get_collection_data': 'getGetCollectionData',
    'get_nft_address_by_index': 'getGetNftAddressByIndex',
    'getNftItemInit': 'getGetNftItemInit',
    'get_nft_content': 'getGetNftContent',
    'royalty_params': 'getRoyaltyParams',
}

const NftCollection_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"Mint"}},
    {"receiver":"internal","message":{"kind":"typed","type":"GetRoyaltyParams"}},
    {"receiver":"internal","message":{"kind":"typed","type":"SetAllowedMint"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export class NftCollection implements Contract {
    
    static async init(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams) {
        return await NftCollection_init(owner_address, collection_content, royalty_params);
    }
    
    static async fromInit(owner_address: Address, collection_content: Cell, royalty_params: RoyaltyParams) {
        const init = await NftCollection_init(owner_address, collection_content, royalty_params);
        const address = contractAddress(0, init);
        return new NftCollection(address, init);
    }
    
    static fromAddress(address: Address) {
        return new NftCollection(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  NftCollection_types,
        getters: NftCollection_getters,
        receivers: NftCollection_receivers,
        errors: NftCollection_errors,
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Mint | GetRoyaltyParams | SetAllowedMint | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Mint') {
            body = beginCell().store(storeMint(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'GetRoyaltyParams') {
            body = beginCell().store(storeGetRoyaltyParams(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'SetAllowedMint') {
            body = beginCell().store(storeSetAllowedMint(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetCollectionData(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('get_collection_data', builder.build())).stack;
        const result = loadTupleCollectionData(source.readTuple());
        return result;
    }
    
    async getGetNftAddressByIndex(provider: ContractProvider, item_index: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(item_index);
        let source = (await provider.get('get_nft_address_by_index', builder.build())).stack;
        let result = source.readAddressOpt();
        return result;
    }
    
    async getGetNftItemInit(provider: ContractProvider, item_index: bigint) {
        let builder = new TupleBuilder();
        builder.writeNumber(item_index);
        let source = (await provider.get('getNftItemInit', builder.build())).stack;
        const result = loadTupleStateInit(source.readTuple());
        return result;
    }
    
    async getGetNftContent(provider: ContractProvider, index: bigint, individual_content: Cell) {
        let builder = new TupleBuilder();
        builder.writeNumber(index);
        builder.writeCell(individual_content);
        let source = (await provider.get('get_nft_content', builder.build())).stack;
        let result = source.readCell();
        return result;
    }
    
    async getRoyaltyParams(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('royalty_params', builder.build())).stack;
        const result = loadTupleRoyaltyParams(source.readTuple());
        return result;
    }
    
}