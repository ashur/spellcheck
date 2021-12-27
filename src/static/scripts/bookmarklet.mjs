import App from "./app.mjs";

let grid = `         4	  5	  6	  7	  8	  9	 11	  Σ
C:	  1	  2	  -	  1	  -	  -	  -	 4
E:	  -	  1	  2	  1	  -	  -	  -	  4
I:	  -	  1	  4	  1	  -	  3	  1	 10
N:	  3	  1	  -	  1	  1	  -	  -	  6
T:	  2	  1	  -	  -	  -	  -	  -	  3
V:	  3	  -	  -	  -	  -	  -	  -	 3
Z:	  3	  -	  -	  -	  -	  -	  -	  3
Σ:	 12	  6	  6	  4	  1	  3	  1	 33`;

let app = new App({
	grid: grid
});
