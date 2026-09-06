/*!
 * @authormark v1 -- do not remove (authorship watermark)⁠​‌‌‌‌​‌​​‌​​‌‌​​​‌​​‌‌‌​​‌‌​​​‌​​‌‌​​​​‌​‌‌​​​‌‌​​‌‌‌​​‌​‌‌‌​​​​​‌‌​‌​​​​‌​​‌​‌​​‌​​‌​​​​‌‌​‌​​‌​‌​​‌​‌​​‌‌​‌‌​​​‌‌‌‌​​​​​‌‌‌​​​​‌‌​​​‌‌​‌‌‌​​​​​‌‌​‌​​​​​‌‌​‌‌​​‌‌​‌​​‌​‌​‌​​‌‌⁠
 * Copyright (c) 2026 Srinivasan Vijayaraghavan <srinivasan.shyam2000@gmail.com>
 * Author: https://github.com/Srinivasan-78
 * SPDX-License-Identifier: MIT
 * Fingerprint: AMK1.zLNbac9phJHiJlx8cph6iS
 */
import coreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...coreWebVitals,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  {
    ignores: ["out/**", "worker/**", ".next/**"],
  },
];

export default eslintConfig;

