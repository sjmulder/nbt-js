export as namespace nbt;
/**
 * A mapping from type names to NBT type numbers.
 * {@link nbt.Writer} and {@link nbt.Reader}
 * have correspoding methods (e.g. {@link nbt.Writer.prototype.int})
 * for every type.
*/
export const tagTypes: {
    readonly end: 0;
    readonly byte: 1;
    readonly short: 2;
    readonly int: 3;
    readonly long: 4;
    readonly float: 5;
    readonly double: 6;
    readonly byteArray: 7;
    readonly string: 8;
    readonly list: 9;
    readonly compound: 10;
    readonly intArray: 11;
    readonly longArray: 12;
};
export type tagTypes = typeof tagTypes;
export type TagType = tagTypes[keyof tagTypes];
/**
 * A mapping from NBT type numbers to type names.
*/
export const tagTypeNames: {
    0: "end";
    1: "byte";
    2: "short";
    3: "int";
    4: "long";
    5: "float";
    6: "double";
    7: "byteArray";
    8: "string";
    9: "list";
    10: "compound";
    11: "intArray";
    12: "longArray";
};
export type tagTypeNames = typeof tagTypeNames;
export type TagTypeName = tagTypeNames[keyof tagTypeNames];
export interface RootTag {
    name: string;
    value: CompoundTag["value"];
}
export type Tag = ByteTag | ShortTag | IntTag | LongTag | FloatTag | DoubleTag | ByteArrayTag | StringTag | ListTag<Tag> | CompoundTag | IntArrayTag | LongArrayTag;
export interface ByteTag {
    type: tagTypeNames[tagTypes["byte"]];
    value: number;
}
export interface ShortTag {
    type: tagTypeNames[tagTypes["short"]];
    value: number;
}
export interface IntTag {
    type: tagTypeNames[tagTypes["int"]];
    value: number;
}
export interface LongTag {
    type: tagTypeNames[tagTypes["long"]];
    value: [number, number];
}
export interface FloatTag {
    type: tagTypeNames[tagTypes["float"]];
    value: number;
}
export interface DoubleTag {
    type: tagTypeNames[tagTypes["double"]];
    value: number;
}
export interface ByteArrayTag {
    type: tagTypeNames[tagTypes["byteArray"]];
    value: number[];
}
export interface StringTag {
    type: tagTypeNames[tagTypes["string"]];
    value: string;
}
export interface ListTag<T extends Tag> {
    type: tagTypeNames[tagTypes["list"]];
    value: {
        type: T["type"];
        value: T["value"][];
    };
}
export interface CompoundTag {
    type: tagTypeNames[tagTypes["compound"]];
    value: {
        [name: string]: Tag;
    };
}
export interface IntArrayTag {
    type: tagTypeNames[tagTypes["intArray"]];
    value: number[];
}
export interface LongArrayTag {
    type: tagTypeNames[tagTypes["longArray"]];
    value: LongTag["value"][];
}
export type WriterDataType = {
    [K in keyof DataView]: K extends `set${infer T}` ? T extends `Big${string}` ? never : T : never;
}[keyof DataView];
/**
 * In addition to the named writing methods documented below,
 * the same methods are indexed by the NBT type number as well,
 * as shown in the example below.
 *
 * @see {@link nbt.Reader}
 *
 * @example
 * var writer = new nbt.Writer();
 *
 * // all equivalent
 * writer.int(42);
 * writer[3](42);
 * writer(nbt.tagTypes.int)(42);
 *
 * // overwrite the second int
 * writer.offset = 0;
 * writer.int(999);
 *
 * return writer.buffer; */
export class Writer {
    /** Will be resized (x2) on write if necessary. */
    buffer: ArrayBuffer;
    /** This is recreated when the buffer is */
    dataView: DataView;
    /** This is recreated when the buffer is */
    arrayView: Uint8Array;
    /**
     * The location in the buffer where bytes are written or read.
     * This increases after every write, but can be freely changed.
     * The buffer will be resized when necessary.
    */
    offset: number;
    /**
     * Returns the writen data as a slice from the internal buffer,
     * cutting off any padding at the end.
     *
     * @returns a [0, offset] slice of the interal buffer */
    getData(): ArrayBuffer;
    /**
     * @param value - a signed byte
     * @returns itself */
    byte: (value: number) => this;
    [tagTypes.byte]: (value: number) => this;
    /**
     * @param value - an unsigned byte
     * @returns itself */
    ubyte: (value: number) => this;
    /**
     * @param value - a signed 16-bit integer
     * @returns itself */
    short: (value: number) => this;
    [tagTypes.short]: (value: number) => this;
    /**
     * @param value - a signed 32-bit integer
     * @returns itself */
    int: (value: number) => this;
    [tagTypes.int]: (value: number) => this;
    /**
     * @param value - a signed 32-bit float
     * @returns itself */
    float: (value: number) => this;
    [tagTypes.float]: (value: number) => this;
    /**
     * @param value - a signed 64-bit float
     * @returns itself */
    double: (value: number) => this;
    [tagTypes.double]: (value: number) => this;
    /**
     * As JavaScript does not support 64-bit integers natively, this
     * method takes an array of two 32-bit integers that make up the
     * upper and lower halves of the long.
     *
     * @param value - [upper, lower]
     * @returns itself */
    long: (value: LongTag["value"]) => this;
    [tagTypes.long](value: LongTag["value"]): this;
    /**
     * @returns itself */
    byteArray: (value: ByteArrayTag["value"] | Uint8Array) => this;
    [tagTypes.byteArray](value: ByteArrayTag["value"] | Uint8Array): this;
    /**
     * @returns itself */
    intArray: (value: IntArrayTag["value"]) => this;
    [tagTypes.intArray](value: IntArrayTag["value"]): this;
    /**
     * @returns itself */
    longArray: (value: LongArrayTag["value"]) => this;
    [tagTypes.longArray](value: LongArrayTag["value"]): this;
    /**
     * @returns itself */
    string: (value: StringTag["value"]) => this;
    [tagTypes.string](value: StringTag["value"]): this;
    /**
     * @param value
     * @param value.type - the NBT type number
     * @param value.value - an array of values
     * @returns itself */
    list: (value: ListTag<Tag>["value"]) => this;
    [tagTypes.list](value: ListTag<Tag>["value"]): this;
    /**
     * @param value - a key/value map
     * @param value.KEY
     * @param value.KEY.type - the NBT type number
     * @param value.KEY.value - a value matching the type
     * @returns itself
     *
     * @example
     * writer.compound({
     *     foo: { type: 'int', value: 12 },
     *     bar: { type: 'string', value: 'Hello, World!' }
     * }); */
    compound: (value: CompoundTag["value"]) => this;
    [tagTypes.compound](value: CompoundTag["value"]): this;
}
export type ReaderDataType = {
    [K in keyof DataView]: K extends `get${infer T}` ? T extends `Big${string}` ? never : T : never;
}[keyof DataView];
/**
 * In addition to the named writing methods documented below,
 * the same methods are indexed by the NBT type number as well,
 * as shown in the example below.
 *
 * @see {@link nbt.Writer}
 *
 * @example
 * var reader = new nbt.Reader(buf);
 * int x = reader.int();
 * int y = reader[3]();
 * int z = reader[nbt.tagTypes.int](); */
export class Reader {
    constructor(buffer: ArrayBuffer | Uint8Array);
    /**
     * The current location in the buffer. Can be freely changed
     * within the bounds of the buffer. */
    offset: number;
    buffer: ArrayBuffer | Uint8Array;
    arrayView: Uint8Array;
    dataView: DataView;
    read(dataType: ReaderDataType, size: number): number;
    /**
     * @returns the read byte */
    byte: () => number;
    [tagTypes.byte]: () => number;
    /**
     * @returns the read unsigned byte */
    ubyte: () => number;
    /**
     * @returns the read signed 16-bit short  */
    short: () => number;
    [tagTypes.short]: () => number;
    /**
     * @returns the read signed 32-bit integer */
    int: () => number;
    [tagTypes.int]: () => number;
    /**
     * @returns the read signed 32-bit float */
    float: () => number;
    [tagTypes.float]: () => number;
    /**
     * @returns the read signed 64-bit float */
    double: () => number;
    [tagTypes.double]: () => number;
    /**
     * As JavaScript does not not natively support 64-bit
     * integers, the value is returned as an array of two
     * 32-bit integers, the upper and the lower.
     *
     * @returns [upper, lower] */
    long: () => LongTag["value"];
    [tagTypes.long](): LongTag["value"];
    /**
     * @returns the read array */
    byteArray: () => ByteArrayTag["value"];
    [tagTypes.byteArray](): ByteArrayTag["value"];
    /**
     * @returns the read array of 32-bit ints */
    intArray: () => IntArrayTag["value"];
    [tagTypes.intArray](): IntArrayTag["value"];
    /**
     * As JavaScript does not not natively support 64-bit
     * integers, the value is returned as an array of arrays of two
     * 32-bit integers, the upper and the lower.
     *
     * @returns the read array of 64-bit ints
     *     split into [upper, lower] */
    longArray: () => LongArrayTag["value"];
    [tagTypes.longArray](): LongArrayTag["value"];
    /**
     * @returns the read string */
    string: () => StringTag["value"];
    [tagTypes.string](): StringTag["value"];
    /**
     * @example
     * reader.list();
     * // -> { type: 'string', values: ['foo', 'bar'] } */
    list: () => ListTag<Tag>["value"];
    [tagTypes.list](): ListTag<Tag>["value"];
    /**
     * @example
     * reader.compound();
     * // -> { foo: { type: int, value: 42 },
     * //      bar: { type: string, value: 'Hello! }} */
    compound: () => CompoundTag["value"];
    [tagTypes.compound](): CompoundTag["value"];
}
/**
 * @param value a named compound
 * @param value.name the top-level name
 * @param value.value a compound
 *
 * @see {@link nbt.parseUncompressed}
 * @see {@link nbt.Writer.prototype.compound}
 *
 * @example
 * nbt.writeUncompressed({
 *     name: 'My Level',
 *     value: {
 *         foo: { type: int, value: 42 },
 *         bar: { type: string, value: 'Hi!' }
 *     }
 * }); */
export function writeUncompressed(value: RootTag): ArrayBuffer;
/**
 * @param data an uncompressed NBT archive
 * @returns a named compound
 *
 * @see {@link nbt.parse}
 * @see {@link nbt.writeUncompressed}
 *
 * @example
 * nbt.readUncompressed(buf);
 * // -> { name: 'My Level',
 * //      value: { foo: { type: int, value: 42 },
 * //               bar: { type: string, value: 'Hi!' }}} */
export function parseUncompressed(data: ArrayBuffer | Uint8Array): RootTag;
/**
 * @param result a named compound
 * @param result.name the top-level name
 * @param result.value the top-level compound
*/
export type parseCallback = {
    (error: Error, result: null): void;
    (error: null, result: RootTag): void;
};
/**
 * This accepts both gzipped and uncompressd NBT archives.
 * If the archive is uncompressed, the callback will be
 * called directly from this method. For gzipped files, the
 * callback is async.
 *
 * For use in the browser, window.zlib must be defined to decode
 * compressed archives. It will be passed a Buffer if the type is
 * available, or an Uint8Array otherwise.
 *
 * @param data gzipped or uncompressed data
 *
 * @see {@link nbt.parseUncompressed}
 * @see {@link nbt.Reader.prototype.compound}
 *
 * @example
 * nbt.parse(buf, function(error, results) {
 *     if (error) {
 *         throw error;
 *     }
 *     console.log(result.name);
 *     console.log(result.value.foo);
 * }); */
export function parse(data: ArrayBuffer | Uint8Array, callback: parseCallback): void;
