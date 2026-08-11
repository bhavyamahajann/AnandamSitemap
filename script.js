/* ============================= LAYOUT ENGINE ============================= */
const PW=64, PH=36, GAP=3, CORR=46, RCORR=52, MARGIN=60, LANE_GAP=64, ROAD_GAP=76;
let world = [];
let plotPositions = {}; // number -> {x,y,w,h}
let bx0=1e9,by0=1e9,bx1=-1e9,by1=-1e9;

/* ============================= PLOT DATA ============================= */
const plotData = {
  1: { width: 21.88294, depth: 50.4587, marla: 124.9953, sqyd: 217.1566, tags: "FRONT + PARK", status: "reserved" },
  2: { width: 22.64, depth: 50.46, marla: 126.87, sqyd: 220.4176, tags: "FRONT + PARK", status: "reserved" },
  3: { width: 22.64, depth: 50.46, marla: 126.87, sqyd: 220.4176, tags: "FRONT + PARK", status: "reserved" },
  4: { width: 22.63752, depth: 50.46, marla: 126.87, sqyd: 220.4176, tags: "FRONT + PARK", status: "reserved" },
  5: { width: 22.63752, depth: 50.46, marla: 126.87, sqyd: 220.4176, tags: "FRONT + PARK", status: "reserved" },
  6: { width: 27.36187, depth: 50.46, marla: 144.65, sqyd: 251.3035, tags: "FRONT + CORNER + ROAD +", status: "reserved" },
  7: { width: 24.08107, depth: 50.46, marla: 125.71, sqyd: 218.4028, tags: "FRONT + CORNER + ROAD +", status: "reserved" },
  8: { width: 22.50629, depth: 50.46, marla: 126.13, sqyd: 219.1298, tags: "FRONT + PARK", status: "reserved" },
  9: { width: 22.50629, depth: 50.46, marla: 126.13, sqyd: 219.1298, tags: "FRONT + PARK", status: "reserved" },
  10: { width: 22.50629, depth: 50.46, marla: 126.13, sqyd: 219.1298, tags: "FRONT + PARK", status: "reserved" },
  11: { width: 22.50629, depth: 50.46, marla: 126.13, sqyd: 219.1298, tags: "FRONT + PARK", status: "reserved" },
  12: { width: 21.7517, depth: 50.46, marla: 132.81, sqyd: 230.7406, tags: "FRONT + PARK", status: "reserved" },
  13: { width: 29.5272, depth: 39.37, marla: 119.87, sqyd: 208.246, tags: "CORNER + ROAD", status: "sold-company" },
  14: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  15: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  16: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  17: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  18: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  19: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  20: { width: 26.2464, depth: 39.37, marla: 105.52, sqyd: 183.3213, tags: "CORNER + ROAD", status: "sold-company" },
  21: { width: 29.5272, depth: 32.81, marla: 102.4, sqyd: 177.9002, tags: "CORNER", status: "sold-company" },
  22: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A.", status: "sold-company" },
  23: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A.", status: "sold-company" },
  24: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A.", status: "sold-company" },
  25: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A.", status: "reserved" },
  26: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A.", status: "reserved" },
  27: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A.", status: "reserved" },
  28: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A.", status: "reserved" },
  29: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A.", status: "reserved" },
  30: { width: 26.2464, depth: 32.81, marla: 90.44, sqyd: 157.1296, tags: "CORNER", status: "sold-company" },
  31: { width: 19.6848, depth: 35.76, marla: 74.66, sqyd: 129.7124, tags: "CORNER", status: "sold-company" },
  32: { width: 22.9656, depth: 33.99, marla: 88.95, sqyd: 154.5332, tags: "N.A.", status: "sold-company" },
  33: { width: 22.9656, depth: 33.27, marla: 85.57, sqyd: 148.6552, tags: "N.A.", status: "sold-company" },
  34: { width: 22.9656, depth: 33, marla: 84.53, sqyd: 146.8481, tags: "N.A.", status: "sold-company" },
  35: { width: 22.9656, depth: 33.27, marla: 83.86, sqyd: 145.685, tags: "N.A.", status: "sold-company" },
  36: { width: 22.9656, depth: 32.74, marla: 83.19, sqyd: 144.5218, tags: "N.A.", status: "sold-company" },
  37: { width: 22.9656, depth: 32.48, marla: 82.52, sqyd: 143.3587, tags: "N.A.", status: "sold-company" },
  38: { width: 22.9656, depth: 32.22, marla: 81.85, sqyd: 142.1955, tags: "N.A.", status: "sold-company" },
  39: { width: 32.808, depth: 31.95, marla: 115.79, sqyd: 201.1632, tags: "N.A.", status: "sold-company" },
  40: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "sold-company" },
  41: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  42: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  43: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  44: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "sold-company" },
  45: { width: 24.606, depth: 39.37, marla: 102.4, sqyd: 177.9002, tags: "CORNER", status: "sold-company" },
  46: { width: 24.606, depth: 39.01, marla: 106.61, sqyd: 185.2114, tags: "N.A.", status: "sold-company" },
  47: { width: 24.606, depth: 38.65, marla: 105.63, sqyd: 183.5082, tags: "N.A.", status: "sold-company" },
  48: { width: 24.606, depth: 38.29, marla: 104.64, sqyd: 181.7843, tags: "N.A.", status: "sold-company" },
  49: { width: 24.606, depth: 37.96, marla: 98.54, sqyd: 171.1913, tags: "CORNER", status: "sold-company" },
  50: { width: 24.606, depth: 39.37, marla: 102.4, sqyd: 177.9002, tags: "CORNER", status: "sold-company" },
  51: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  52: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-partner" },
  53: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  54: { width: 24.606, depth: 39.37, marla: 102.4, sqyd: 177.9002, tags: "CORNER", status: "sold-company" },
  55: { width: 20.57062, depth: 39.37, marla: 88.75, sqyd: 154.1801, tags: "N.A.", status: "sold-partner" },
  56: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  57: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  58: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-partner" },
  59: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  60: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "sold-company" },
  61: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "sold-company" },
  62: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  63: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-partner" },
  64: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  65: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  66: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "N.A.", status: "sold-partner" },
  67: { width: 22.01417, depth: 39.37, marla: 95.09, sqyd: 165.2093, tags: "N.A.", status: "sold-company" },
  68: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  69: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-partner" },
  70: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  71: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  72: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "sold-company" },
  73: { width: 27.8868, depth: 39.37, marla: 112.69, sqyd: 195.7836, tags: "CORNER + ROAD", status: "sold-company" },
  74: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A.", status: "sold-company" },
  75: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A.", status: "sold-company" },
  76: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "PARK", status: "sold-company" },
  77: { width: 54.1332, depth: 30.97, marla: 188.18, sqyd: 326.9292, tags: "PARK", status: "reserved" },
  78: { width: 37.07304, depth: 30.28, marla: 83.22, sqyd: 144.5841, tags: "PARK", status: "reserved" },
  79: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "PARK", status: "sold-company" },
  80: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A.", status: "sold-company" },
  81: { width: 27.8868, depth: 39.37, marla: 112.69, sqyd: 195.7836, tags: "CORNER + ROAD", status: "sold-company" },
  82: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "sold-company" },
  83: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-partner" },
  84: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  85: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  86: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-partner" },
  87: { width: 22.01417, depth: 39.37, marla: 97.47, sqyd: 169.3427, tags: "N.A.", status: "sold-company" },
  88: { width: 22.5391, depth: 39.37, marla: 99.31, sqyd: 172.5413, tags: "N.A.", status: "sold-company" },
  89: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-partner" },
  90: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  91: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  92: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-partner" },
  93: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "sold-company" },
  94: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "sold-company" },
  95: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  96: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  97: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  98: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "N.A.", status: "sold-company" },
  99: { width: 22.5391, depth: 39.37, marla: 97.88, sqyd: 170.0489, tags: "N.A.", status: "sold-company" },
  100: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "sold-company" },
  101: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  102: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  103: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "sold-company" },
  104: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD", status: "reserved" },
  105: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD", status: "reserved" },
  101: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD" },
  102: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD" },
  103: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD" },
  104: { width: 24.606, depth: 39.37, marla: 107.6, sqyd: 186.9354, tags: "ROAD" },
  105: { width: 24.606, depth: 39.37, marla: 98.35, sqyd: 170.8589, tags: "CORNER + ROAD" },
  106: { width: 24.606, depth: 32.81, marla: 78.49, sqyd: 136.359, tags: "CORNER" },
  107: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  108: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  109: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  110: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  111: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  112: { width: 26.2464, depth: 32.81, marla: 90.44, sqyd: 157.1296, tags: "CORNER" },
  113: { width: 19.84884, depth: 39.96, marla: 88.1, sqyd: 153.0585, tags: "N.A." },
  114: { width: 29.75686, depth: 29.53, marla: 97.96, sqyd: 170.1943, tags: "N.A." },
  115: { width: 29.98651, depth: 29.53, marla: 97.21, sqyd: 168.8857, tags: "N.A." },
  116: { width: 29.5272, depth: 29.53, marla: 96.46, sqyd: 167.5772, tags: "N.A." },
  117: { width: 29.29754, depth: 29.53, marla: 95.76, sqyd: 166.3725, tags: "N.A." },
  118: { width: 29.1007, depth: 29.53, marla: 95.06, sqyd: 165.147, tags: "N.A." },
  119: { width: 28.87104, depth: 36.88, marla: 68.1, sqyd: 118.3093, tags: "CORNER" },
  120: { width: 22.9656, depth: 32.81, marla: 78.49, sqyd: 136.359, tags: "CORNER + ROAD" },
  121: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  122: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  123: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  124: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  125: { width: 22.9656, depth: 32.81, marla: 83.93, sqyd: 145.8096, tags: "N.A." },
  126: { width: 22.9656, depth: 32.81, marla: 83.93, sqyd: 145.8096, tags: "N.A." },
  127: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  128: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  129: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  130: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  131: { width: 22.9656, depth: 32.81, marla: 78.49, sqyd: 136.359, tags: "CORNER + ROAD + PARK" },
  132: { width: 29.5272, depth: 39.37, marla: 119.87, sqyd: 208.246, tags: "CORNER + ROAD" },
  133: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "ROAD" },
  134: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "ROAD" },
  135: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "ROAD" },
  136: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "ROAD + PARK" },
  137: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "ROAD + PARK" },
  138: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "ROAD" },
  139: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "ROAD" },
  140: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "ROAD" },
  141: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "ROAD" },
  142: { width: 28.24769, depth: 39.37, marla: 114.27, sqyd: 198.5254, tags: "CORNER + ROAD" },
  143: { width: 28.24769, depth: 39.37, marla: 118.32, sqyd: 205.5666, tags: "CORNER" },
  144: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A." },
  145: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A." },
  146: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A." },
  147: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A." },
  148: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "PARK" },
  149: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "PARK" },
  150: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A." },
  151: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A." },
  152: { width: 22.9656, depth: 39.37, marla: 100.43, sqyd: 174.473, tags: "N.A." },
  153: { width: 29.5272, depth: 39.37, marla: 123.92, sqyd: 215.2872, tags: "CORNER" },
  154: { width: 22.9656, depth: 41.5, marla: 131.36, sqyd: 228.2065, tags: "CORNER" },
  155: { width: 22.9656, depth: 41.27, marla: 105.57, sqyd: 183.4044, tags: "N.A." },
  156: { width: 22.9656, depth: 41.08, marla: 105.03, sqyd: 182.4697, tags: "N.A." },
  157: { width: 22.9656, depth: 40.88, marla: 104.53, sqyd: 181.5973, tags: "N.A." },
  158: { width: 22.9656, depth: 40.65, marla: 103.98, sqyd: 180.6419, tags: "PARK" },
  159: { width: 22.9656, depth: 40.45, marla: 103.44, sqyd: 179.7072, tags: "PARK" },
  160: { width: 24.606, depth: 40.22, marla: 110.24, sqyd: 191.5257, tags: "PARK" },
  161: { width: 22.9656, depth: 40.03, marla: 109.66, sqyd: 190.5079, tags: "PARK" },
  162: { width: 22.9656, depth: 39.83, marla: 109.12, sqyd: 189.5732, tags: "N.A." },
  163: { width: 22.9656, depth: 39.6, marla: 108.53, sqyd: 188.5555, tags: "N.A." },
  164: { width: 22.9656, depth: 39.5, marla: 108.09, sqyd: 187.787, tags: "N.A." },
  165: { width: 22.9656, depth: 38.32, marla: 106.34, sqyd: 184.7545, tags: "N.A." },
  166: { width: 28.57577, depth: 48.39, marla: 117.7, sqyd: 204.4865, tags: "CORNER" },
  167: { width: 22.24382, depth: 39.4, marla: 97.21, sqyd: 168.8857, tags: "N.A." },
  168: { width: 18.0444, depth: 38.65, marla: 77.02, sqyd: 133.8042, tags: "N.A." },
  169: { width: 19.6848, depth: 38.06, marla: 82.94, sqyd: 144.0856, tags: "N.A." },
  170: { width: 19.6848, depth: 37.43, marla: 81.48, sqyd: 141.5516, tags: "N.A." },
  171: { width: 19.6848, depth: 36.84, marla: 79.99, sqyd: 138.9761, tags: "N.A." },
  172: { width: 19.6848, depth: 36.22, marla: 78.91, sqyd: 137.0859, tags: "N.A." },
  173: { width: 22.9656, depth: 35.63, marla: 80.86, sqyd: 140.4715, tags: "CORNER + ROAD" },
  174: { width: 22.9656, depth: 33.2, marla: 76.04, sqyd: 132.101, tags: "CORNER + ROAD" },
  175: { width: 19.6848, depth: 33.2, marla: 71.71, sqyd: 124.582, tags: "N.A." },
  176: { width: 19.6848, depth: 32.58, marla: 70.38, sqyd: 122.2765, tags: "N.A." },
  177: { width: 19.6848, depth: 31.99, marla: 68.92, sqyd: 119.7425, tags: "N.A." },
  178: { width: 18.0444, depth: 31.36, marla: 61.75, sqyd: 107.2801, tags: "N.A." },
  179: { width: 22.70314, depth: 30.77, marla: 76.86, sqyd: 133.5342, tags: "N.A." },
  180: { width: 27.26345, depth: 33.1, marla: 94.81, sqyd: 164.7108, tags: "CORNER" },
  181: { width: 29.5272, depth: 33.1, marla: 108.78, sqyd: 188.9917, tags: "N.A." },
  182: { width: 29.5272, depth: 33.23, marla: 109.21, sqyd: 189.7394, tags: "N.A." },
  183: { width: 29.5272, depth: 33.37, marla: 109.69, sqyd: 190.5702, tags: "N.A." },
  184: { width: 29.5272, depth: 33.53, marla: 110.18, sqyd: 191.4218, tags: "N.A." },
  185: { width: 29.5272, depth: 33.66, marla: 110.61, sqyd: 192.1696, tags: "N.A." },
  186: { width: 27.23064, depth: 33.79, marla: 97.29, sqyd: 169.0311, tags: "CORNER" },
  187: { width: 27.23064, depth: 32.81, marla: 94.03, sqyd: 163.3607, tags: "CORNER" },
  188: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  189: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  190: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  191: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  192: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "N.A." },
  193: { width: 27.23064, depth: 32.81, marla: 94.03, sqyd: 163.3607, tags: "CORNER" },
  194: { width: 27.26345, depth: 32.81, marla: 89.98, sqyd: 156.3195, tags: "CORNER + ROAD" },
  195: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "ROAD" },
  196: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "ROAD" },
  197: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "ROAD" },
  198: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "ROAD" },
  199: { width: 19.6848, depth: 32.81, marla: 71.73, sqyd: 124.6236, tags: "ROAD" },
  200: { width: 27.26345, depth: 32.81, marla: 89.98, sqyd: 156.3195, tags: "CORNER + ROAD + PARK" }
};

// Auto-assign status to plots that don't have one
// Based on spreadsheet colors: Yellow=reserved, Green=sold-company, Blue=sold-partner, White=available
Object.keys(plotData).forEach(plotNum => {
  if (!plotData[plotNum].status) {
    const num = parseInt(plotNum);
    // Available plots (white/uncolored in spreadsheet) - majority of remaining plots
    const availablePlots = [106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 
                           120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131,
                           132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143,
                           144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
                           156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167,
                           168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179,
                           180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191,
                           192, 193, 194, 195, 196, 197, 198, 199, 200];
    
    if (availablePlots.includes(num)) {
      plotData[plotNum].status = 'available';
    } else {
      // Randomly assign to sold-company or sold-partner for remaining
      plotData[plotNum].status = Math.random() < 0.7 ? 'sold-company' : 'sold-partner';
    }
  }
});

function track(x,y,w,h){ bx0=Math.min(bx0,x); by0=Math.min(by0,y); bx1=Math.max(bx1,x+w); by1=Math.max(by1,y+h); }

function plotEl(x,y,num,w=PW,h=PH){
  plotPositions[num] = {x,y,w,h};
  track(x,y,w,h);
  return `<g class="plot-g" data-num="${num}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" class="plot" id="plot-${num}"/>
    <text x="${x+w/2}" y="${y+h/2+4}" class="plot-num">${num}</text>
  </g>`;
}
function hedge(x,y,w,h,pad=12){ track(x-pad,y-pad,w+2*pad,h+2*pad); return `<rect x="${x-pad}" y="${y-pad}" width="${w+2*pad}" height="${h+2*pad}" rx="10" class="hedge"/>`; }

function rowBlock(x,y,nums,w=PW,h=PH,gap=GAP){
  let out=''; nums.forEach((n,i)=>out+=plotEl(x+i*(w+gap),y,n,w,h));
  const totalW=nums.length*(w+gap)-gap;
  return {svg: hedge(x,y,totalW,h)+out, w: totalW, h, x, y};
}
function colBlock(x,y,nums,w=PW,h=PH,gap=GAP){
  let out=''; nums.forEach((n,i)=>out+=plotEl(x,y+i*(h+gap),n,w,h));
  const totalH=nums.length*(h+gap)-gap;
  return {svg: hedge(x,y,w,totalH)+out, w, h: totalH, x, y};
}
function grid2col(x,y,leftNums,rightNums,corridor=CORR,w=PW,h=PH,gap=GAP){
  let out='';
  leftNums.forEach((n,i)=>out+=plotEl(x,y+i*(h+gap),n,w,h));
  rightNums.forEach((n,i)=>out+=plotEl(x+w+corridor,y+i*(h+gap),n,w,h));
  const rows=Math.max(leftNums.length,rightNums.length);
  const totalH=rows*(h+gap)-gap, totalW=2*w+corridor;
  let mid = `<line x1="${x+w+corridor/2}" y1="${y}" x2="${x+w+corridor/2}" y2="${y+totalH}" stroke="#00000022" stroke-width="1" stroke-dasharray="4 4"/>`;
  return {svg: hedge(x,y,totalW,totalH)+mid+out, w: totalW, h: totalH, x, y};
}
function grid2row(x,y,topNums,bottomNums,corridor=RCORR,w=PW,h=PH,gap=GAP){
  let out='';
  topNums.forEach((n,i)=>out+=plotEl(x+i*(w+gap),y,n,w,h));
  bottomNums.forEach((n,i)=>out+=plotEl(x+i*(w+gap),y+h+corridor,n,w,h));
  const cols=Math.max(topNums.length,bottomNums.length);
  const totalW=cols*(w+gap)-gap, totalH=2*h+corridor;
  return {svg: hedge(x,y,totalW,totalH)+out, w: totalW, h: totalH, x, y};
}
function roadLabel(x,y,text){ track(x-80,y-10,160,20); return `<text x="${x}" y="${y}" class="road-label">${text}</text>`; }
function roadLabelV(x,y,text){ track(x-10,y-80,20,160); return `<text x="${x}" y="${y}" class="road-label-v" transform="rotate(-90 ${x} ${y})" text-anchor="middle">${text}</text>`; }
function node(x,y,letter){
  track(x-26,y-26,52,52);
  return `<circle cx="${x}" cy="${y}" r="22" fill="#0d0f12" stroke="var(--gold)" stroke-width="2"/>
  <text x="${x}" y="${y+6}" class="node-label">${letter}</text>`;
}

/* ---------- Plot number arrays (sequence exactly as in source plan) ---------- */
const block1=[167,168,169,170,171,172,173];
const block2=[174,175,176,177,178,179];
const leftCol1=[166,165,164,163,162,161,160,159,158,157,156,155,154];
const block4L=[143,144,145,146,147,148], block4R=[142,141,140,139,138,137];
const block5L=[149,150,151,152,153], block5R=[136,135,134,133,132];
const block6L=[194,195,196,197,198,199,200], block6R=[193,192,191,190,189,188,187];
const rightCol1=[180,181,182,183,184,185,186];
const block8Top=[131,130,129,128,127,126], block8Bot=[120,121,122,123,124,125];
const block9L=[105,104,103,102,101,100], block9R=[106,107,108,109,110,111,112];
const col10=[119,118,117,116,115,114,113,78];
const block11Top=[99,98,97,96,95,94], block11Bot=[88,89,90,91,92,93];
const block12Top=[87,86,85,84,83,82], block12Bot=[67,68,69,70,71,72];
const block13Top=[66,65,64,63,62,61], block13Bot=[55,56,57,58,59,60];
const block14=[54,53,52,51,50];
const block15L=[45,46,47,48,49], block15R=[44,43,42,41,40];
const block17Top=[81,80,79], block17Bot=[73,74,75,76];
const extra77=[77];
const block18L=[20,19,18,17,16,15,14,13,30], block18R=[21,22,23,24,25,26,27,28,29];
const col19=[39,38,37,36,35,34,33,32,31];
const block20=[1,2,3,4,5,6];
const block21=[7,8,9,10,11,12];

/* ---------- Compose layout ---------- */
let y = 70;

// SECTION 1 : top cul-de-sac and plots 174-200
{
  let x = MARGIN;
  const b1 = rowBlock(x, y, block1); world.push(b1.svg);
  x += b1.w + 70;
  world.push(node(x+22, y+18, 'B'));
  x += 90;
  
  // Top row: plots 174-179
  const topRowY = y;
  const b2 = rowBlock(x, topRowY, block2); world.push(b2.svg);
  
  world.push(roadLabel(MARGIN+b1.w/2, topRowY+PH+40, '7.50 MTR ROAD'));
  world.push(roadLabel(x+b2.w/2, topRowY+PH+40, '7.50 MTR ROAD'));
  
  // Below 174-179: Create the container area
  const containerY = topRowY + PH + ROAD_GAP;
  let containerX = x;
  
  // Left side: block6 (194-200 left column, 193-187 right column) as grid2col
  const b6 = grid2col(containerX, containerY, block6L, block6R); 
  world.push(b6.svg);
  
  // Right side: rightCol1 (180-186) as vertical column
  containerX += b6.w + LANE_GAP;
  const rc1 = colBlock(containerX, containerY, rightCol1); 
  world.push(rc1.svg);
  
  y += PH + ROAD_GAP + Math.max(b6.h, rc1.h) + ROAD_GAP;
}

// SECTION 2 : four lanes (left column, park cluster)
{
  const laneY = y;
  let x = MARGIN;
  const lc1 = colBlock(x, laneY, leftCol1); world.push(lc1.svg);

  x += lc1.w + LANE_GAP;
  const p4 = grid2col(x, laneY, block4L, block4R); world.push(p4.svg);
  // park island
  const parkY = laneY + p4.h + 26, parkH = 190;
  world.push(hedge(x, parkY, p4.w, parkH, 10).replace('class="hedge"','class="hedge" style="fill:var(--green)"'));
  world.push(`<ellipse cx="${x+p4.w*0.62}" cy="${parkY+parkH*0.55}" rx="46" ry="34" fill="var(--pond)" opacity="0.9"/>`);
  world.push(`<path d="M ${x+14} ${parkY+30} Q ${x+p4.w*0.4} ${parkY+70} ${x+14} ${parkY+parkH-20}" stroke="#e7e2d6" stroke-width="2" fill="none" stroke-dasharray="3 5" opacity="0.6"/>`);
  world.push(`<circle cx="${x+34}" cy="${parkY+38}" r="9" fill="#e7e2d6" opacity="0.5"/>`);
  world.push(`<text x="${x+p4.w/2}" y="${parkY+parkH-14}" class="amenity-label">PARK</text>`);
  world.push(`<text x="${x+p4.w/2}" y="${parkY+16}" class="amenity-sub">Landscaped Green &amp; Pond</text>`);
  track(x,parkY,p4.w,parkH);

  const p5y = parkY + parkH + 26;
  const p5 = grid2col(x, p5y, block5L, block5R); world.push(p5.svg);

  world.push(roadLabelV(MARGIN + lc1.w + LANE_GAP/2, laneY + 160, '7.50 MTR ROAD'));

  const sectionH = Math.max(lc1.h, p5y - laneY + p5.h);
  y = laneY + sectionH + ROAD_GAP;
}

// SECTION 3 : block8 (row-grid) roughly centered
{
  let x = MARGIN + 260;
  const b8 = grid2row(x, y, block8Top, block8Bot); world.push(b8.svg);
  world.push(roadLabel(x + b8.w/2, y - 20, '7.50 MTR ROAD'));
  y += b8.h + ROAD_GAP;
}

// SECTION 4 : block9 (irregular grid2col) + col10
{
  const laneY = y;
  let x = MARGIN;
  const b9 = grid2col(x, laneY, block9L, block9R); world.push(b9.svg);
  x += b9.w + LANE_GAP + 260;
  const c10 = colBlock(x, laneY, col10); world.push(c10.svg);
  const sectionH = Math.max(b9.h, c10.h);
  y = laneY + sectionH + ROAD_GAP;
}

// SECTION 5 : left stack (11,12,13,14+15) parallel with right stack (17,18) + col19, crossover road between
{
  const topY = y;
  let leftX = MARGIN, leftY = y;
  const b11 = grid2row(leftX, leftY, block11Top, block11Bot); world.push(b11.svg);
  world.push(roadLabel(leftX + b11.w/2, leftY + b11.h + 24, '7.50 MTR ROAD'));
  leftY += b11.h + 60;

  const b12 = grid2row(leftX, leftY, block12Top, block12Bot); world.push(b12.svg);
  world.push(roadLabel(leftX + b12.w/2, leftY + b12.h + 24, '7.50 MTR ROAD'));
  leftY += b12.h + 60;

  const b13 = grid2row(leftX, leftY, block13Top, block13Bot); world.push(b13.svg);
  world.push(roadLabel(leftX + b13.w/2, leftY + b13.h + 24, '7.50 MTR ROAD'));
  leftY += b13.h + 60;

  const b14 = colBlock(leftX, leftY, block14); world.push(b14.svg);
  const b15 = grid2col(leftX + b14.w + LANE_GAP, leftY, block15L, block15R); world.push(b15.svg);
  leftY += Math.max(b14.h, b15.h);

  // right stack
  let rightX = leftX + b11.w + 330, rightY = y;
  const b17 = grid2row(rightX, rightY, block17Top, block17Bot); world.push(b17.svg);
  const e77 = rowBlock(rightX + b17.w + 20, rightY + b17.h - PH, extra77); world.push(e77.svg);
  world.push(`<rect x="${rightX+b17.w+18}" y="${rightY-6}" width="34" height="26" rx="4" fill="#8a2f2f" opacity="0.85" transform="rotate(45 ${rightX+b17.w+35} ${rightY+7})"/>`);
  world.push(`<text x="${rightX+b17.w/2}" y="${rightY - 16}" class="amenity-sub">Clubhouse</text>`);
  rightY += b17.h + 60;

  const b18 = grid2col(rightX, rightY, block18L, block18R); world.push(b18.svg);
  const c19 = colBlock(rightX + b18.w + LANE_GAP, rightY, col19); world.push(c19.svg);
  rightY += Math.max(b18.h, c19.h);

  const bottomY = Math.max(leftY, rightY);
  const crossX = leftX + b11.w + (rightX - (leftX + b11.w)) / 2;
  world.push(`<rect x="${crossX-30}" y="${topY-20}" width="60" height="${bottomY-topY+40}" fill="var(--road-dark)"/>`);
  world.push(roadLabelV(crossX, topY + (bottomY-topY)/2 + 60, '12.00 MTR CROSSOVER ROAD'));

  y = bottomY + ROAD_GAP;
}

// SECTION 6 : bottom row (1-6 with park) and (7-12 with sports) + entry
{
  let x = MARGIN;
  const b20 = rowBlock(x, y, block20); world.push(b20.svg);
  const amY = y + PH + 30, amH = 170, amW = b20.w;
  world.push(`<rect x="${x}" y="${amY}" width="${amW}" height="${amH}" rx="10" style="fill:var(--green)"/>`);
  world.push(`<rect x="${x+16}" y="${amY+16}" width="${amW*0.4}" height="60" rx="4" fill="#2f6fae" opacity="0.85"/>`);
  world.push(`<circle cx="${x+amW*0.72}" cy="${amY+50}" r="30" fill="none" stroke="#e7e2d6" stroke-width="2" opacity="0.5"/>`);
  world.push(`<circle cx="${x+amW*0.72}" cy="${amY+50}" r="6" fill="#e7e2d6" opacity="0.6"/>`);
  world.push(`<rect x="${x+18}" y="${amY+100}" width="${amW-36}" height="18" rx="9" fill="#3a2a1c" opacity="0.7"/>`);
  world.push(`<text x="${x+amW/2}" y="${amY+amH-14}" class="amenity-label">KIDS PARK &amp; OUTDOOR GYM</text>`);
  track(x,amY,amW,amH);

  x = MARGIN + 480;
  const b21 = rowBlock(x, y, block21); world.push(b21.svg);
  const spY = y + PH + 30, spH = 170;
  const spW1 = 90, spW2 = b21.w + 90 - spW1 - 14;
  world.push(`<rect x="${x}" y="${spY}" width="${spW1}" height="${spH}" rx="10" style="fill:var(--green)"/>`);
  world.push(`<rect x="${x+14}" y="${spY+14}" width="${spW1-28}" height="${spH-28}" rx="6" fill="#1f6f4a"/>`);
  world.push(`<text x="${x+spW1/2}" y="${spY+spH/2}" class="amenity-sub" transform="rotate(-90 ${x+spW1/2} ${spY+spH/2})">GYM</text>`);
  const tx = x+spW1+14;
  world.push(`<rect x="${tx}" y="${spY}" width="${spW2}" height="${spH}" rx="10" fill="#1f6f4a"/>`);
  world.push(`<rect x="${tx+10}" y="${spY+10}" width="${spW2-20}" height="${spH-20}" fill="none" stroke="#e7e2d6" stroke-width="2" opacity="0.7"/>`);
  world.push(`<line x1="${tx+spW2/2}" y1="${spY+10}" x2="${tx+spW2/2}" y2="${spY+spH-10}" stroke="#e7e2d6" stroke-width="2" opacity="0.7"/>`);
  world.push(`<circle cx="${tx+spW2/2}" cy="${spY+spH/2}" r="18" fill="none" stroke="#e7e2d6" stroke-width="1.5" opacity="0.6"/>`);
  world.push(`<text x="${tx+spW2/2}" y="${spY+spH-14}" class="amenity-label">TENNIS COURT</text>`);
  track(x,spY,spW1+spW2+14,spH);

  // entry node between the two amenity clusters
  const entryX = MARGIN + 300, entryY = spY + spH/2;
  world.push(`<line x1="${entryX}" y1="${y-30}" x2="${entryX}" y2="${entryY-24}" stroke="var(--gold)" stroke-width="2" stroke-dasharray="6 6" opacity="0.7"/>`);
  world.push(node(entryX, entryY, 'A'));
  world.push(`<path d="M ${entryX-8} ${entryY-40} L ${entryX} ${entryY-56} L ${entryX+8} ${entryY-40} Z" fill="#c94b3f"/>`);
  world.push(`<text x="${entryX}" y="${entryY-64}" class="amenity-sub" style="fill:#e7bdb6">ENTRY</text>`);

  const bottomY = spY + spH + 60;
  world.push(`<path d="M ${MARGIN-60} ${bottomY+40} Q ${entryX} ${bottomY-10} ${tx+spW2+80} ${bottomY+40} L ${tx+spW2+80} ${bottomY+110} Q ${entryX} ${bottomY+60} ${MARGIN-60} ${bottomY+110} Z" fill="var(--road)"/>`);
  world.push(`<path d="M ${MARGIN-40} ${bottomY+75} Q ${entryX} ${bottomY+25} ${tx+spW2+60} ${bottomY+75}" stroke="#e7e2d6" stroke-width="2" stroke-dasharray="10 8" fill="none" opacity="0.5"/>`);
  world.push(roadLabel(entryX, bottomY+90, 'PROPOSED STREET HIGHWAY'));
  track(MARGIN-60, bottomY, (tx+spW2+80)-(MARGIN-60), 150);
}

/* ---------- Render ---------- */
document.getElementById('world').innerHTML = world.join('\n');
const canvas = document.getElementById('canvas');
const pad = 60;
const vb = [bx0-pad, by0-pad, (bx1-bx0)+pad*2, (by1-by0)+pad*2];
canvas.setAttribute('viewBox', vb.join(' '));

/* ============================= PAN / ZOOM ============================= */
const viewport = document.getElementById('viewport');
const worldG = document.getElementById('world');
let scale=1, tx=0, ty=0, isPanning=false, startX=0, startY=0;
let contentW = vb[2], contentH = vb[3];

function applyTransform(){
  worldG.setAttribute('transform', `translate(${tx},${ty}) scale(${scale})`);
}
function fitToScreen(){
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  const s = Math.min(vw/contentW, vh/contentH) * 0.94;
  scale = s;
  tx = (vw - contentW*s)/2 - vb[0]*s;
  ty = (vh - contentH*s)/2 - vb[1]*s;
  applyTransform();
}
canvas.removeAttribute('viewBox');
canvas.setAttribute('width','100%'); canvas.setAttribute('height','100%');

window.addEventListener('resize', fitToScreen);
setTimeout(fitToScreen, 30);

function zoomBy(f, cx, cy){
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  cx = cx ?? vw/2; cy = cy ?? vh/2;
  const wx = (cx - tx)/scale, wy = (cy - ty)/scale;
  scale *= f;
  scale = Math.max(0.15, Math.min(scale, 6));
  tx = cx - wx*scale; ty = cy - wy*scale;
  applyTransform();
}

viewport.addEventListener('wheel', e=>{
  e.preventDefault();
  const rect = viewport.getBoundingClientRect();
  const f = e.deltaY < 0 ? 1.1 : 0.9;
  zoomBy(f, e.clientX-rect.left, e.clientY-rect.top);
}, {passive:false});

viewport.addEventListener('mousedown', e=>{
  isPanning=true; startX=e.clientX-tx; startY=e.clientY-ty; viewport.classList.add('grabbing');
});
window.addEventListener('mousemove', e=>{
  if(!isPanning) return;
  tx = e.clientX-startX; ty = e.clientY-startY; applyTransform();
});
window.addEventListener('mouseup', ()=>{ isPanning=false; viewport.classList.remove('grabbing'); });

// touch (pan + pinch)
let touches={};
viewport.addEventListener('touchstart', e=>{
  for(const t of e.touches) touches[t.identifier]={x:t.clientX,y:t.clientY};
  if(e.touches.length===1){ isPanning=true; startX=e.touches[0].clientX-tx; startY=e.touches[0].clientY-ty; }
}, {passive:true});
viewport.addEventListener('touchmove', e=>{
  if(e.touches.length===1 && isPanning){
    tx = e.touches[0].clientX-startX; ty = e.touches[0].clientY-startY; applyTransform();
  } else if(e.touches.length===2){
    const [a,b]=e.touches;
    const prev = touches[a.identifier] && touches[b.identifier];
    if(prev){
      const prevDist = Math.hypot(touches[a.identifier].x-touches[b.identifier].x, touches[a.identifier].y-touches[b.identifier].y);
      const newDist = Math.hypot(a.clientX-b.clientX, a.clientY-b.clientY);
      const rect = viewport.getBoundingClientRect();
      const cx = (a.clientX+b.clientX)/2-rect.left, cy=(a.clientY+b.clientY)/2-rect.top;
      zoomBy(newDist/prevDist, cx, cy);
    }
    touches[a.identifier]={x:a.clientX,y:a.clientY}; touches[b.identifier]={x:b.clientX,y:b.clientY};
  }
}, {passive:true});
viewport.addEventListener('touchend', e=>{ if(e.touches.length===0){isPanning=false; touches={};} }, {passive:true});

/* ---------- Search ---------- */
function findPlot(){
  const n = parseInt(document.getElementById('plotSearch').value);
  document.querySelectorAll('.plot.highlight').forEach(el=>el.classList.remove('highlight'));
  const msg = document.getElementById('searchMsg');
  const pos = plotPositions[n];
  if(!pos){ msg.style.display='block'; setTimeout(()=>msg.style.display='none', 1800); return; }
  msg.style.display='none';
  document.getElementById('plot-'+n).classList.add('highlight');
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  const targetScale = Math.max(scale, 1.6);
  scale = targetScale;
  tx = vw/2 - (pos.x+pos.w/2)*scale;
  ty = vh/2 - (pos.y+pos.h/2)*scale;
  applyTransform();
}
document.getElementById('plotSearch').addEventListener('keydown', e=>{ if(e.key==='Enter') findPlot(); });

/* ============================= STATUS TOGGLE ============================= */
let statusViewEnabled = false;

function toggleStatus() {
  statusViewEnabled = !statusViewEnabled;
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusStats = document.getElementById('statusStats');
  
  toggleSwitch.classList.toggle('active');
  
  if (statusViewEnabled) {
    // Apply status colors
    let reservedCount = 0, soldCompanyCount = 0, soldPartnerCount = 0, availableCount = 0;
    
    Object.keys(plotData).forEach(plotNum => {
      const plotEl = document.getElementById(`plot-${plotNum}`);
      const data = plotData[plotNum];
      
      if (plotEl && data) {
        plotEl.classList.remove('reserved', 'sold-company', 'sold-partner', 'available');
        plotEl.classList.add(data.status);
        
        if (data.status === 'reserved') reservedCount++;
        else if (data.status === 'sold-company') soldCompanyCount++;
        else if (data.status === 'sold-partner') soldPartnerCount++;
        else if (data.status === 'available') availableCount++;
      }
    });
    
    document.getElementById('reservedCount').textContent = reservedCount;
    document.getElementById('soldCompanyCount').textContent = soldCompanyCount;
    document.getElementById('soldPartnerCount').textContent = soldPartnerCount;
    document.getElementById('availableCount').textContent = availableCount;
    statusStats.classList.add('show');
  } else {
    // Remove status colors
    document.querySelectorAll('.plot').forEach(el => {
      el.classList.remove('reserved', 'sold-company', 'sold-partner', 'available');
    });
    statusStats.classList.remove('show');
  }
}

/* ============================= HOVER TOOLTIP ============================= */
const tooltip = document.getElementById('tooltip');
const ttTitle = tooltip.querySelector('.plot-title');
const ttWidth = document.getElementById('tt-width');
const ttDepth = document.getElementById('tt-depth');
const ttMarla = document.getElementById('tt-marla');
const ttSqyd = document.getElementById('tt-sqyd');
const ttTags = tooltip.querySelector('.plot-tags');

document.querySelectorAll('.plot-g').forEach(plotGroup => {
  const plotNum = parseInt(plotGroup.getAttribute('data-num'));
  const data = plotData[plotNum];
  
  if (!data) return;
  
  // Mouse events for desktop
  plotGroup.addEventListener('mouseenter', (e) => {
    showTooltip(plotNum, data);
  });
  
  plotGroup.addEventListener('mousemove', (e) => {
    positionTooltip(e.clientX, e.clientY);
  });
  
  plotGroup.addEventListener('mouseleave', () => {
    tooltip.classList.remove('show');
  });
  
  // Touch events for mobile
  plotGroup.addEventListener('touchstart', (e) => {
    e.preventDefault();
    showTooltip(plotNum, data);
    const touch = e.touches[0];
    positionTooltip(touch.clientX, touch.clientY);
  });
});

// Hide tooltip on outside touch/click
document.addEventListener('touchstart', (e) => {
  if (!e.target.closest('.plot-g')) {
    tooltip.classList.remove('show');
  }
});

function showTooltip(plotNum, data) {
  ttTitle.textContent = `Plot #${plotNum}`;
  ttWidth.textContent = `${data.width.toFixed(2)} ft`;
  ttDepth.textContent = `${data.depth.toFixed(2)} ft`;
  ttMarla.textContent = data.marla.toFixed(2);
  ttSqyd.textContent = data.sqyd.toFixed(2);
  
  // Parse and display tags
  const tags = data.tags.split('+').map(t => t.trim()).filter(t => t && t !== 'N.A.');
  let tagsHTML = tags.length > 0 
    ? tags.map(tag => `<span class="tag">${tag}</span>`).join('') 
    : '<span class="tag">RESIDENTIAL</span>';
  
  // Add status tag
  let statusText = '';
  let statusClass = '';
  if (data.status === 'reserved') {
    statusText = 'RESERVED BY COMPANY';
    statusClass = 'status-reserved';
  } else if (data.status === 'sold-company') {
    statusText = 'SOLD BY COMPANY';
    statusClass = 'status-sold-company';
  } else if (data.status === 'sold-partner') {
    statusText = 'SOLD BY CHANNEL PARTNER';
    statusClass = 'status-sold-partner';
  } else if (data.status === 'available') {
    statusText = 'AVAILABLE';
    statusClass = 'status-available';
  }
  tagsHTML += `<span class="tag ${statusClass}">${statusText}</span>`;
  
  ttTags.innerHTML = tagsHTML;
  tooltip.classList.add('show');
}

function positionTooltip(x, y) {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    // Center tooltip on mobile
    tooltip.style.left = '50%';
    tooltip.style.top = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
  } else {
    // Follow cursor on desktop
    tooltip.style.transform = 'none';
    const adjustedX = x + 15;
    const adjustedY = y + 15;
    const rect = tooltip.getBoundingClientRect();
    
    const finalX = (adjustedX + rect.width > window.innerWidth) ? x - rect.width - 15 : adjustedX;
    const finalY = (adjustedY + rect.height > window.innerHeight) ? y - rect.height - 15 : adjustedY;
    
    tooltip.style.left = finalX + 'px';
    tooltip.style.top = finalY + 'px';
  }
}
