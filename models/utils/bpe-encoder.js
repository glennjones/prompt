

//const {encode, decode} = require('gpt-3-encoder')
import {encode, decode} from 'gpt-3-encoder'

export function getEncoder() {
    return new Encoder();
}

// wrap to match the interface of the python version
class Encoder{
    constructor() {}

    encode(text) {
        return encode(text);
    }

    decode(tokens) {
        return decode(tokens);
    }
}

/*
bpe_file = {"filename": "vocab.bpe", "link": "https://github.com/syonfox/GPT-3-Encoder/raw/master/vocab.bpe"}
encoder_file = {"filename": "encoder.json", "link": "https://github.com/syonfox/GPT-3-Encoder/raw/master/encoder.json"}

function bytes_to_unicode() {
    var bs = (
        list(range(ord("!"), ord("~") + 1)) + list(range(ord("¡"), ord("¬") + 1)) + list(range(ord("®"), ord("ÿ") + 1))
    )
    var cs = bs[:]
    var n = 0
    for (var b in range(2**8)) {
        if (b not in bs) {
            bs.append(b)
            cs.append(2**8 + n)
            n += 1
        }
    }
    cs = [chr(n) for n in cs]
    return dict(zip(bs, cs))
}

function getPairs(word) {
    var pairs = new Set();
    var prevChar = word[0];
    for (var i = 1; i < word.length; i++) {
        pairs.add(prevChar + word[i]);
        prevChar = word[i];
    }
    return pairs;
}


class Encoder {
    constructor(encoder, bpe_merges, errors="replace") {
        this.encoder = encoder;
        this.decoder = {v: k for (k, v) in this.encoder.items()};
        this.errors = errors;
        this.byte_encoder = bytes_to_unicode();
        this.byte_decoder = {v: k for (k, v) in this.byte_encoder.items()};
        this.bpe_ranks = dict(zip(bpe_merges, range(len(bpe_merges))));
        this.cache = {};
        this.pat = re.compile(r"""'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+""");
    }

    bpe(token) {
        if (token in this.cache) {
            return this.cache[token];
        }
        var word = tuple(token);
    
        var pairs = get_pairs(word);
    
        if (!pairs) {
            return token;
        }
    
        while (true) {
            var bigram = min(pairs, function (pair) {
                return this.bpe_ranks.get(pair, float("inf"));
            });
            if (bigram not in this.bpe_ranks) {
                break;
            }
            var first, second = bigram;
            var new_word = [];
            var i = 0;
            while (i < len(word)) {
                try {
                    var j = word.index(first, i);
                    new_word.extend(word[i:j]);
                    i = j;
                } catch {
                    new_word.extend(word[i:]);
                    break;
                }
    
                if (word[i] == first && i < len(word) - 1 && word[i + 1] == second) {
                    new_word.append(first + second);
                    i += 2;
                } else {
                    new_word.append(word[i]);
                    i += 1;
                }
            }
            new_word = tuple(new_word);
            word = new_word;
            if (len(word) == 1) {
                break;
            } else {
                pairs = get_pairs(word);
            }
        }
        word = " ".join(word);
        this.cache[token] = word;
        return word;
    }

    encode(text) {
        let bpe_tokens = [];
        for (let token of re.findall(this.pat, text)) {
            token = "".join(this.byte_encoder[b] for b in token.encode("utf-8"))
    
            bpe_tokens.extend(this.encoder[bpe_token] for bpe_token in this.bpe(token).split(" "))
        }
        return bpe_tokens
    }
    
    decode(tokens) {
        let text = "".join([this.decoder[token] for token in tokens])
        text = bytearray([this.byte_decoder[c] for c in text]).decode("utf-8", errors=this.errors)
        return text
    }
}

function getEncoder() {
    const encoderFilename = download(encoderFile.link, encoderFile.filename);
    const bpeFilename = download(bpeFile.link, bpeFile.filename);
    const encoder = JSON.parse(fs.readFileSync(encoderFilename, "utf-8"));
    const bpeData = fs.readFileSync(bpeFilename, "utf-8");
    const bpeMerges = bpeData.split("\n").slice(1, -1).map(mergeStr => mergeStr.split());
    return new Encoder(encoder, bpeMerges);
}
*/
