export const replaceSvgColor = (svgText: string, newColor: string): string => {
    console.log('we are in');

    let modifiedSvg = svgText.replace(/(<(path|g|svg)[^>]*style="[^"]*)stroke\s*:\s*#[0-9a-fA-F]{3,6}([^"]*)"/gi,
        (match, p1, tag, p3) => {
            return `${p1}stroke:${newColor}${p3}"`;
        }
    );
    modifiedSvg = modifiedSvg.replace(
        /(stroke|fill)\s*:\s*(?!none)(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)/gi,
        (match, prop) => `${prop}:${newColor}`
    );

    modifiedSvg = modifiedSvg.replace(
        /(<[^>]*style="[^"]*)(stroke|fill)\s*:\s*(?!none)(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)([^"]*)"/gi,
        (match, p1, prop, oldColor, p4) => `${p1}${prop}:${newColor}${p4}"`
    );

    modifiedSvg = modifiedSvg.replace(
        /(<[^>]*?)\s*(stroke|fill)\s*=\s*"(?!none)(#[0-9a-fA-F]{3,6}|[a-zA-Z]+)"([^>]*>)/gi,
        (match, p1, prop, oldColor, p4) => `${p1} ${prop}="${newColor}"${p4}`
    );

    return modifiedSvg;
}
