const $ = (x) => document.querySelectorAll(x);

function sliceEmoji(str) {
    let res = ['', ''];

    for (let c of str) {
        let n = c.codePointAt(0);
        let isEmoji = n > 0xfff || n === 0x200d || (0xfe00 <= n && n <= 0xfeff);
        res[1 - isEmoji] += c;
    }
    return res;
}

function hex(str) {
    return [...str].map(x => x.codePointAt(0).toString(16));
}

function emojiToCodePoints(emoji) {
    return sliceEmoji(emoji).map(hex);
}

function emojiURL(emoji) {
    return "https://emojicdn.elk.sh/" + emojiToCodePoints(emoji).join('-') + "png";
}