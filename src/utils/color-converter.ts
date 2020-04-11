import { RGB, HSL } from "../types";

export function hexToRGB(hex: string) : RGB {
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
    return RGBToHSL(hexToRGB(hex));
}

export function RGBToHex(rgb: RGB) : string {
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

export function getContrastYIQ(hex: string){
    if(!hex) {
        return "black";
    }

    const {r,g,b} = hexToRGB(hex);
	const yiq = ((r*299)+(g*587)+(b*114))/1000;
	return yiq >= 128 ? 'rgba(0,0,0,.87)' : '#e0e0e0';
}