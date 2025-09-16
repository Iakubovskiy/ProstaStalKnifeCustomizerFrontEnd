export const replaceSvgColor = (svgText: string, newColor: string): string => {
    console.log('we are in');

    let modifiedSvg = svgText.replace(/(<(path|g|svg)[^>]*style="[^"]*)stroke\s*:\s*#[0-9a-fA-F]{3,6}([^"]*)"/gi,
        (match, p1, tag, p3) => {
            return `${p1}stroke:${newColor}${p3}"`;
        }
    );
    modifiedSvg = modifiedSvg.replace(/(<(path|g|svg)[^>]*)fill\s*=\s*"#[0-9a-fA-F]{3,6}"([^"]*)"/gi,
        (match, p1, tag, p3) => {
            return `${p1}fill="${newColor}"${p3}"`;
        }
    );

    modifiedSvg = modifiedSvg.replace(
        /(fill|stroke)\s*:\s*(?!none)(#[0-9a-fA-F]{3,6})/gi,
        (match, prop, oldColor) => {
            return `${prop}:${newColor}`;
        }
    );

    return modifiedSvg;
}
