import { RGB, HSL } from "../types";

export const Black : HSL = { h: 0, s: 0, l: 0 };
export const White : HSL = { h: 0, s: 100, l: 100 };

export function hexToRGB(hex: string) : RGB {
    if(!stringValidHex(hex)) {
        return undefined;
    }

    let r = "0", g = "0", b = "0";

    // 3 digits
    if (hex.length == 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    // 6 digits
    } else if (hex.length == 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }
    
    return { r: +r, g: +g, b: +b };
}

export function hexToHSL(hex: string) {
    if(!stringValidHex(hex)) {
        return undefined;
    }

    return RGBToHSL(hexToRGB(hex));
}

export function RGBToHex(rgb: RGB) : string {
    if(!rgb) {
        return undefined;
    }

    let r = rgb.r.toString(16);
    let g = rgb.g.toString(16);
    let b = rgb.b.toString(16);

    if (r.length == 1) {
        r = "0" + r;
    }
    if (g.length == 1) {
        g = "0" + g;
    }
    if (b.length == 1) {
        b = "0" + b;
    }

    return "#" + r + g + b;
}

export function RGBToHSL(rgb: RGB) : HSL {
    if(!rgb) {
        return undefined;
    }

    // Make r, g, and b fractions of 1
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
    cmax = Math.max(r,g,b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

    // Calculate hue
    // No difference
    if (delta == 0) {
        h = 0;
    }
    // Red is max
    else if (cmax == r) {
        h = ((g - b) / delta) % 6;
    }
    // Green is max
    else if (cmax == g) {
        h = (b - r) / delta + 2;
    }
    // Blue is max
    else {
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0) {
        h += 360;
    }

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return { h, s, l };
}

export function HSLToHex(hsl: HSL) : string {
    return RGBToHex(HSLToRGB(hsl));
}

export function HSLToRGB(hsl: HSL) : RGB {
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((hsl.h / 60) % 2 - 1)),
      m = l - c/2,
      r = 0,
      g = 0,
      b = 0;

      if (0 <= hsl.h && hsl.h < 60) {
        r = c; g = x; b = 0;
      } else if (60 <= hsl.h && hsl.h < 120) {
        r = x; g = c; b = 0;
      } else if (120 <= hsl.h && hsl.h < 180) {
        r = 0; g = c; b = x;
      } else if (180 <= hsl.h && hsl.h < 240) {
        r = 0; g = x; b = c;
      } else if (240 <= hsl.h && hsl.h < 300) {
        r = x; g = 0; b = c;
      } else if (300 <= hsl.h && hsl.h < 360) {
        r = c; g = 0; b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);
    
      return { r, g, b };
}

export function getContrastYIQ(color: HSL){
    if(!color) {
        return 'rgba(0,0,0,.87)';
    }

    const {r,g,b} = HSLToRGB(color);
	const yiq = ((r*299)+(g*587)+(b*114))/1000;
	return yiq >= 128 ? 'rgba(0,0,0,.87)' : '#e0e0e0';
}

export function convertToTypeString(value: HSL, type: string) : string {
    switch(type) {
        case "hsl":
            return convertHSLToString(value);
        case "hex":
            return HSLToHex(value);
        case "rgb":
            return convertRGBToString(HSLToRGB(value));
    }
}

export function convertHSLToString(value: HSL) {
    return `hsl(${value.h}, ${value.s}%, ${value.l}%)`;
}

export function convertRGBToString(value: RGB) {
    return `rgb(${value.r}, ${value.g}, ${value.b})`;
}

export function convertStringToRGB(value: string) : RGB {
    if(!value) {
        return undefined;
    }

    // trim, lower and remove whitespace
    const primed = value.trim().toLowerCase().replace(/\s/g, "");

    if(primed.indexOf("rgb(") === -1 || primed.indexOf(")") !== primed.length - 1) {
        return undefined;
    }

    const stripped = primed.replace("rgb(", "").replace(")", "");

    const split = stripped.split(",");
    if(split.length !== 3) {
        return undefined;
    }

    const r = parseInt(split[0].trim());
    const g = parseInt(split[1].trim());
    const b = parseInt(split[2].trim());

    if(isNaN(r) || isNaN(g) || isNaN(b)) {
        return undefined;
    }

    if(r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        return undefined;
    }

    return {r,g,b};
}

export function convertStringToHSL(value: string) : HSL {
    if(!value) {
        return undefined;
    }

    const primed = value.trim().toLowerCase().replace(/\s/g, "");

    if(primed.indexOf("hsl(") === -1 || primed.indexOf(")") !== primed.length - 1) {
        return undefined;
    }

    const stripped = primed.replace("hsl(", "").replace(")", "");

    const split = stripped.split(",");
    if(split.length !== 3) {
        return undefined;
    }

    const h = parseInt(split[0].trim());
    const s = parseInt(split[1].replace("%","").trim());
    const l = parseInt(split[2].replace("%","").trim());

    if(isNaN(h) || isNaN(s) || isNaN(l)) {
        return undefined;
    }

    if(h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
        return undefined;
    }

    return {h,s,l};
}

export function stringValidHex(value: string) {
    if(!value) {
        return false;
    }

    let valid = value.indexOf("#") === 0 && (value.length === 4 || value.length === 7);

    if(!valid) {
        return false;
    }

    const allowed = "0123456789abcdef";
    for(let i = 1; i < value.length; i++) {
        if(allowed.indexOf(value.charAt(i)) === -1) {
            valid = false;
            break;
        }
    }

    return valid;
}