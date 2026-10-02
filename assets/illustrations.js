// Draws a stand-in WhatsClip window into every element marked data-illustration="<kind>".
// A panel that carries real screenshots has no such element, and this file has nothing to do.
(() => {
    const icon = "img/icon-256.png";
    const name = '<span class="wm">What<span class="s">s</span><span class="c">Clip</span></span>';

    const stripText = [["Text", "from CF_UNICODETEXT"], 0, ["CF_UNICODETEXT"], ["CF_TEXT", "synthesized"], ["CF_OEMTEXT", "synthesized"], ["CF_LOCALE", "synthesized"]];
    const stripCode = [["Text", "from CF_UNICODETEXT"], 0, ["CF_UNICODETEXT"], ["Rich Text Format"], ["HTML Format"], ["CF_TEXT", "synthesized"], ["CF_LOCALE", "synthesized"]];
    const stripBoth = [["Picture", "from PNG"], ["Text", "from CF_UNICODETEXT"], 0, ["PNG"], ["HTML Format"], ["CF_UNICODETEXT"], ["CF_DIBV5"], ["CF_DIB", "synthesized"], ["CF_BITMAP", "synthesized"]];
    const stripPicture = [["Picture", "from PNG"], 0, ["PNG"], ["CF_DIBV5"], ["CF_DIB", "synthesized"], ["CF_BITMAP", "synthesized"]];
    const stripAnsi = [["Text", "from CF_TEXT"], 0, ["CF_TEXT"], ["CF_LOCALE"]];

    const code = `<span class="k">module</span> ClaFi.Tools.WhatsClip.Main;

<span class="k">import</span> ClaFi.Core.Transfer.Clipboard;
<span class="k">import</span> ClaFi.StdLib;

<span class="k">namespace</span> ClaFi::Tools::WhatsClip
{
    <span class="c">// Room for the platform's own CF_ names on one line.</span>
    <span class="k">constexpr float</span> k_stripWidth = <span class="n">200.0f</span>;
    <span class="k">constexpr</span> std::<span class="t">wstring_view</span> k_note = <span class="s">L"synthesized"</span>;

    [[<span class="k">nodiscard</span>]] <span class="k">bool</span> <span class="f">isPresent</span>(<span class="k">const</span> <span class="t">FormatList</span>& formats)
    {
        <span class="k">return</span> std::ranges::<span class="f">any_of</span>(formats, matches);
    }
}`;

    const htmlFormat = `Version:0.9
StartHTML:0000000105
EndHTML:0000000371
StartFragment:0000000141
EndFragment:0000000335
&lt;html&gt;&lt;body&gt;
&lt;!--StartFragment--&gt;&lt;p&gt;Shows what is on the &lt;b&gt;clipboard&lt;/b&gt;,
format by format.&lt;/p&gt;&lt;!--EndFragment--&gt;
&lt;/body&gt;&lt;/html&gt;`;

    const scripts = [
        ["Русский", "Съешь же ещё этих мягких французских булок"],
        ["Ελληνικά", "Ξεσκεπάζω την ψυχοφθόρα βδελυγμία"],
        ["العربية", "نص حكيم له سر قاطع وذو شأن عظيم"],
        ["עברית", "דג סקרן שט בים מאוכזב ולפתע מצא חברה"],
        ["हिन्दी", "ऋषियों को सताने वाले दुष्ट राक्षसों के राजा"],
        ["ไทย", "เป็นมนุษย์สุดประเสริฐเลิศคุณค่า"],
        ["ქართული", "ვეპხის ტყაოსანი შოთა რუსთაველი"],
        ["日本語", "いろはにほへと ちりぬるを"],
        ["한국어", "다람쥐 헌 쳇바퀴에 타고파"]
    ];

    const strip = (items, selected) => '<div class="w-strip">' + items.map((item, i) => item === 0
        ? '<div class="w-div"></div>'
        : `<div class="w-tab${i === selected ? " sel" : ""}">${item[0]}${item[1] ? `<small>${item[1]}</small>` : ""}</div>`).join("") + "</div>";

    const pages = {
        syntax: [stripCode, 0, () =>
            `<div class="w-bar"><span class="w-chip">C++</span><span class="w-mut">detected</span><span class="r w-mut">UTF-16, 612 bytes</span></div>
             <div class="w-mono">${code}</div>`],
        astext: [stripCode, 4, () =>
            `<div class="w-bar"><span class="w-chip">UTF-8</span><span class="r w-mut">371 bytes</span></div>
             <div class="w-mono">${htmlFormat}</div>`],
        exotic: [stripText, 0, () =>
            `<div class="w-scripts">${scripts.map(s => `<span>${s[0]}</span><span>${s[1]}</span>`).join("")}</div>`],
        codepage: [stripAnsi, 2, () =>
            `<div class="w-bar"><span class="w-chip">1251 - Cyrillic</span><span class="r w-mut">CF_TEXT, 58 bytes</span></div>
             <div class="w-big" style="margin-top:1.2em">Съешь же ещё этих мягких французских булок, да выпей чаю.</div>
             <div class="w-menu"><div>1250 - Central European</div><div class="on">1251 - Cyrillic</div><div>1252 - Western</div>
             <div>1253 - Greek</div><div>1254 - Turkish</div><div>866 - DOS Cyrillic</div></div>`],
        both: [stripBoth, 0, () =>
            `<div class="w-pic"><img src="${icon}" alt=""></div>`],
        pixels: [stripBoth, 0, () =>
            `<div class="w-bar"><span class="w-mut">Zoom</span><span class="w-slider"></span><span>1600%</span><span class="r"></span>
             <span class="w-sw"></span><span>#4FA8D8</span><span class="w-chip">RGB hex</span></div>
             <div class="w-zoom"><i></i></div>`],
        alpha: [stripPicture, 0, () =>
            `<div class="w-pic">
               <span class="w-glass" style="width:62%;aspect-ratio:1;background:radial-gradient(circle,rgba(232,132,60,1) 0 22%,rgba(232,132,60,0) 68%)"></span>
               <span class="w-glass" style="width:30%;aspect-ratio:1;left:24%;top:16%;border-radius:18%;background:rgba(79,168,216,.55)"></span>
               <span class="w-glass" style="width:30%;aspect-ratio:1;right:22%;bottom:12%;border-radius:18%;background:rgba(126,140,224,.45)"></span>
             </div>`]
    };

    const win = (kind, cls = "", style = "") => {
        const [items, selected, page] = pages[kind];
        return `<div class="win ${cls}" style="${style}" aria-hidden="true">
            <div class="w-title"><img src="${icon}" alt="">${name}<span class="w-ctl"><span>&#8212;</span><span>&#9633;</span><span>&#10005;</span></span></div>
            <div class="w-body">${strip(items, selected)}<div class="w-page">${page()}</div></div></div>`;
    };

    const scenes = {
        dark: () =>
            win("syntax", "l", "inset:0 auto auto 0;width:66%;height:70%;--ws:1.05") +
            win("syntax", "d", "inset:auto 0 0 auto;width:66%;height:70%;--ws:1.05"),
        scale: () =>
            win("astext", "", "inset:auto auto 0 0;width:44%;height:50%;--ws:.75") +
            win("astext", "", "inset:8% 0 auto auto;width:68%;height:80%;--ws:1.3") +
            '<span class="w-tag" style="left:1%;bottom:52%">87%</span><span class="w-tag" style="right:0;top:0">150%</span>',
        themes: () =>
            win("both", "", "inset:0 auto auto 0;width:60%;height:62%;--ws:.95") +
            win("both", "", "inset:19% auto auto 20%;width:60%;height:62%;--ws:.95;--wh:150;--wsat:28%") +
            win("both", "", "inset:auto 0 0 auto;width:60%;height:62%;--ws:.95;--wh:22;--wsat:34%")
    };

    for (const scene of document.querySelectorAll("[data-illustration]")) {
        const kind = scene.dataset.illustration;
        scene.innerHTML = (scenes[kind] ? scenes[kind]() : win(kind)) + '<span class="w-label">Illustration</span>';
    }
})();
