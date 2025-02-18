import { getAspectRatio } from "lib/utils";
import { forwardRef } from "react";
import { Box } from "@livepeer/design-system";

export const phoneFrameMaxWidth = 788;
export const phoneFrameMaxHeight = 394;
export const phoneAspectRatio = getAspectRatio(
  phoneFrameMaxHeight,
  phoneFrameMaxWidth,
  true
) as string;
export const notchZIndex = 10;

const Notch = () => (
  <Box
    as="svg"
    width="27"
    viewBox="0 0 27 201"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    css={{
      position: "absolute",
      top: "50%",
      zIndex: notchZIndex,
      transform: "translateY(-50%)",
      width: "4%",
      left: "3%",
      maxWidth: "27px",
    }}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.52327e-05 0H0V201H1.52402e-05C1.52402e-05 201 0.137438 198.788 1.67678 197.7C3.21613 196.611 3.49628 196.425 7.13453 196.32C10.772 196.215 15.2745 195.088 19.138 192.191C22.8405 189.416 26.6955 184.457 27 177.51V167.556C26.9547 147.657 26.8481 104.157 26.8481 104.157L26.6635 26.528L26.6583 24.3416C26.6354 14.6112 18.7044 9.05313 18.7044 9.05313C18.7044 9.05313 15.5101 6.67597 11.5977 5.79004C8.82435 5.16196 6.72537 5.11309 5.15368 5.0765C3.89151 5.04712 2.9694 5.02565 2.31119 4.71848C0.7044 3.96855 0.0052033 2.12962 1.52327e-05 0Z"
      fill="white"
    />
    <mask
      id="phone-notch-mask0"
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="2"
      y="77"
      width="8"
      height="48">
      <rect x="2" y="77" width="8" height="48" rx="4" fill="#F5F5F5" />
    </mask>
    <g mask="url(#phone-notch-mask0)">
      <rect x="2" y="77" width="8" height="48" rx="4" fill="#F5F5F5" />
      <g opacity="0.5">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 121H1V121.5H0.5V121ZM1.5 121H2V121.5H1.5V121ZM3 121H2.5V121.5H3V121ZM3.5 121H4V121.5H3.5V121ZM5 121H4.5V121.5H5V121ZM5.5 121H6V121.5H5.5V121ZM7 121H6.5V121.5H7V121ZM7.5 121H8V121.5H7.5V121ZM9 121H8.5V121.5H9V121ZM9.5 121H10V121.5H9.5V121ZM2.5 122H2V122.5H2.5V122ZM3.5 122H3V122.5H3.5V122ZM4 122H4.5V122.5H4V122ZM5.5 122H5V122.5H5.5V122ZM6 122H6.5V122.5H6V122ZM7.5 122H7V122.5H7.5V122ZM8 122H8.5V122.5H8V122ZM9.5 122H9V122.5H9.5V122ZM10 122H10.5V122.5H10V122Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 123H1V123.5H0.5V123ZM1.5 123H2V123.5H1.5V123ZM3 123H2.5V123.5H3V123ZM3.5 123H4V123.5H3.5V123ZM5 123H4.5V123.5H5V123ZM5.5 123H6V123.5H5.5V123ZM7 123H6.5V123.5H7V123ZM7.5 123H8V123.5H7.5V123ZM9 123H8.5V123.5H9V123ZM9.5 123H10V123.5H9.5V123ZM2.5 124H2V124.5H2.5V124ZM3.5 124H3V124.5H3.5V124ZM4 124H4.5V124.5H4V124ZM5.5 124H5V124.5H5.5V124ZM6 124H6.5V124.5H6V124ZM7.5 124H7V124.5H7.5V124ZM8 124H8.5V124.5H8V124ZM9.5 124H9V124.5H9.5V124ZM10 124H10.5V124.5H10V124Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 119H1V119.5H0.5V119ZM1.5 119H2V119.5H1.5V119ZM3 119H2.5V119.5H3V119ZM3.5 119H4V119.5H3.5V119ZM5 119H4.5V119.5H5V119ZM5.5 119H6V119.5H5.5V119ZM7 119H6.5V119.5H7V119ZM7.5 119H8V119.5H7.5V119ZM9 119H8.5V119.5H9V119ZM9.5 119H10V119.5H9.5V119ZM2.5 120H2V120.5H2.5V120ZM3.5 120H3V120.5H3.5V120ZM4 120H4.5V120.5H4V120ZM5.5 120H5V120.5H5.5V120ZM6 120H6.5V120.5H6V120ZM7.5 120H7V120.5H7.5V120ZM8 120H8.5V120.5H8V120ZM9.5 120H9V120.5H9.5V120ZM10 120H10.5V120.5H10V120Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 117H1V117.5H0.5V117ZM1.5 117H2V117.5H1.5V117ZM3 117H2.5V117.5H3V117ZM3.5 117H4V117.5H3.5V117ZM5 117H4.5V117.5H5V117ZM5.5 117H6V117.5H5.5V117ZM7 117H6.5V117.5H7V117ZM7.5 117H8V117.5H7.5V117ZM9 117H8.5V117.5H9V117ZM9.5 117H10V117.5H9.5V117ZM2.5 118H2V118.5H2.5V118ZM3.5 118H3V118.5H3.5V118ZM4 118H4.5V118.5H4V118ZM5.5 118H5V118.5H5.5V118ZM6 118H6.5V118.5H6V118ZM7.5 118H7V118.5H7.5V118ZM8 118H8.5V118.5H8V118ZM9.5 118H9V118.5H9.5V118ZM10 118H10.5V118.5H10V118Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 115H1V115.5H0.5V115ZM1.5 115H2V115.5H1.5V115ZM3 115H2.5V115.5H3V115ZM3.5 115H4V115.5H3.5V115ZM5 115H4.5V115.5H5V115ZM5.5 115H6V115.5H5.5V115ZM7 115H6.5V115.5H7V115ZM7.5 115H8V115.5H7.5V115ZM9 115H8.5V115.5H9V115ZM9.5 115H10V115.5H9.5V115ZM2.5 116H2V116.5H2.5V116ZM3.5 116H3V116.5H3.5V116ZM4 116H4.5V116.5H4V116ZM5.5 116H5V116.5H5.5V116ZM6 116H6.5V116.5H6V116ZM7.5 116H7V116.5H7.5V116ZM8 116H8.5V116.5H8V116ZM9.5 116H9V116.5H9.5V116ZM10 116H10.5V116.5H10V116Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 113H1V113.5H0.5V113ZM1.5 113H2V113.5H1.5V113ZM3 113H2.5V113.5H3V113ZM3.5 113H4V113.5H3.5V113ZM5 113H4.5V113.5H5V113ZM5.5 113H6V113.5H5.5V113ZM7 113H6.5V113.5H7V113ZM7.5 113H8V113.5H7.5V113ZM9 113H8.5V113.5H9V113ZM9.5 113H10V113.5H9.5V113ZM2.5 114H2V114.5H2.5V114ZM3.5 114H3V114.5H3.5V114ZM4 114H4.5V114.5H4V114ZM5.5 114H5V114.5H5.5V114ZM6 114H6.5V114.5H6V114ZM7.5 114H7V114.5H7.5V114ZM8 114H8.5V114.5H8V114ZM9.5 114H9V114.5H9.5V114ZM10 114H10.5V114.5H10V114Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 111H1V111.5H0.5V111ZM1.5 111H2V111.5H1.5V111ZM3 111H2.5V111.5H3V111ZM3.5 111H4V111.5H3.5V111ZM5 111H4.5V111.5H5V111ZM5.5 111H6V111.5H5.5V111ZM7 111H6.5V111.5H7V111ZM7.5 111H8V111.5H7.5V111ZM9 111H8.5V111.5H9V111ZM9.5 111H10V111.5H9.5V111ZM2.5 112H2V112.5H2.5V112ZM3.5 112H3V112.5H3.5V112ZM4 112H4.5V112.5H4V112ZM5.5 112H5V112.5H5.5V112ZM6 112H6.5V112.5H6V112ZM7.5 112H7V112.5H7.5V112ZM8 112H8.5V112.5H8V112ZM9.5 112H9V112.5H9.5V112ZM10 112H10.5V112.5H10V112Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 109H1V109.5H0.5V109ZM1.5 109H2V109.5H1.5V109ZM3 109H2.5V109.5H3V109ZM3.5 109H4V109.5H3.5V109ZM5 109H4.5V109.5H5V109ZM5.5 109H6V109.5H5.5V109ZM7 109H6.5V109.5H7V109ZM7.5 109H8V109.5H7.5V109ZM9 109H8.5V109.5H9V109ZM9.5 109H10V109.5H9.5V109ZM2.5 110H2V110.5H2.5V110ZM3.5 110H3V110.5H3.5V110ZM4 110H4.5V110.5H4V110ZM5.5 110H5V110.5H5.5V110ZM6 110H6.5V110.5H6V110ZM7.5 110H7V110.5H7.5V110ZM8 110H8.5V110.5H8V110ZM9.5 110H9V110.5H9.5V110ZM10 110H10.5V110.5H10V110Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 107H1V107.5H0.5V107ZM1.5 107H2V107.5H1.5V107ZM3 107H2.5V107.5H3V107ZM3.5 107H4V107.5H3.5V107ZM5 107H4.5V107.5H5V107ZM5.5 107H6V107.5H5.5V107ZM7 107H6.5V107.5H7V107ZM7.5 107H8V107.5H7.5V107ZM9 107H8.5V107.5H9V107ZM9.5 107H10V107.5H9.5V107ZM2.5 108H2V108.5H2.5V108ZM3.5 108H3V108.5H3.5V108ZM4 108H4.5V108.5H4V108ZM5.5 108H5V108.5H5.5V108ZM6 108H6.5V108.5H6V108ZM7.5 108H7V108.5H7.5V108ZM8 108H8.5V108.5H8V108ZM9.5 108H9V108.5H9.5V108ZM10 108H10.5V108.5H10V108Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 105H1V105.5H0.5V105ZM1.5 105H2V105.5H1.5V105ZM3 105H2.5V105.5H3V105ZM3.5 105H4V105.5H3.5V105ZM5 105H4.5V105.5H5V105ZM5.5 105H6V105.5H5.5V105ZM7 105H6.5V105.5H7V105ZM7.5 105H8V105.5H7.5V105ZM9 105H8.5V105.5H9V105ZM9.5 105H10V105.5H9.5V105ZM2.5 106H2V106.5H2.5V106ZM3.5 106H3V106.5H3.5V106ZM4 106H4.5V106.5H4V106ZM5.5 106H5V106.5H5.5V106ZM6 106H6.5V106.5H6V106ZM7.5 106H7V106.5H7.5V106ZM8 106H8.5V106.5H8V106ZM9.5 106H9V106.5H9.5V106ZM10 106H10.5V106.5H10V106Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 103H1V103.5H0.5V103ZM1.5 103H2V103.5H1.5V103ZM3 103H2.5V103.5H3V103ZM3.5 103H4V103.5H3.5V103ZM5 103H4.5V103.5H5V103ZM5.5 103H6V103.5H5.5V103ZM7 103H6.5V103.5H7V103ZM7.5 103H8V103.5H7.5V103ZM9 103H8.5V103.5H9V103ZM9.5 103H10V103.5H9.5V103ZM2.5 104H2V104.5H2.5V104ZM3.5 104H3V104.5H3.5V104ZM4 104H4.5V104.5H4V104ZM5.5 104H5V104.5H5.5V104ZM6 104H6.5V104.5H6V104ZM7.5 104H7V104.5H7.5V104ZM8 104H8.5V104.5H8V104ZM9.5 104H9V104.5H9.5V104ZM10 104H10.5V104.5H10V104Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 101H1V101.5H0.5V101ZM1.5 101H2V101.5H1.5V101ZM3 101H2.5V101.5H3V101ZM3.5 101H4V101.5H3.5V101ZM5 101H4.5V101.5H5V101ZM5.5 101H6V101.5H5.5V101ZM7 101H6.5V101.5H7V101ZM7.5 101H8V101.5H7.5V101ZM9 101H8.5V101.5H9V101ZM9.5 101H10V101.5H9.5V101ZM2.5 102H2V102.5H2.5V102ZM3.5 102H3V102.5H3.5V102ZM4 102H4.5V102.5H4V102ZM5.5 102H5V102.5H5.5V102ZM6 102H6.5V102.5H6V102ZM7.5 102H7V102.5H7.5V102ZM8 102H8.5V102.5H8V102ZM9.5 102H9V102.5H9.5V102ZM10 102H10.5V102.5H10V102Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 99H1V99.5H0.5V99ZM1.5 99H2V99.5H1.5V99ZM3 99H2.5V99.5H3V99ZM3.5 99H4V99.5H3.5V99ZM5 99H4.5V99.5H5V99ZM5.5 99H6V99.5H5.5V99ZM7 99H6.5V99.5H7V99ZM7.5 99H8V99.5H7.5V99ZM9 99H8.5V99.5H9V99ZM9.5 99H10V99.5H9.5V99ZM2.5 100H2V100.5H2.5V100ZM3.5 100H3V100.5H3.5V100ZM4 100H4.5V100.5H4V100ZM5.5 100H5V100.5H5.5V100ZM6 100H6.5V100.5H6V100ZM7.5 100H7V100.5H7.5V100ZM8 100H8.5V100.5H8V100ZM9.5 100H9V100.5H9.5V100ZM10 100H10.5V100.5H10V100Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 97H1V97.5H0.5V97ZM1.5 97H2V97.5H1.5V97ZM3 97H2.5V97.5H3V97ZM3.5 97H4V97.5H3.5V97ZM5 97H4.5V97.5H5V97ZM5.5 97H6V97.5H5.5V97ZM7 97H6.5V97.5H7V97ZM7.5 97H8V97.5H7.5V97ZM9 97H8.5V97.5H9V97ZM9.5 97H10V97.5H9.5V97ZM2.5 98H2V98.5H2.5V98ZM3.5 98H3V98.5H3.5V98ZM4 98H4.5V98.5H4V98ZM5.5 98H5V98.5H5.5V98ZM6 98H6.5V98.5H6V98ZM7.5 98H7V98.5H7.5V98ZM8 98H8.5V98.5H8V98ZM9.5 98H9V98.5H9.5V98ZM10 98H10.5V98.5H10V98Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 95H1V95.5H0.5V95ZM1.5 95H2V95.5H1.5V95ZM3 95H2.5V95.5H3V95ZM3.5 95H4V95.5H3.5V95ZM5 95H4.5V95.5H5V95ZM5.5 95H6V95.5H5.5V95ZM7 95H6.5V95.5H7V95ZM7.5 95H8V95.5H7.5V95ZM9 95H8.5V95.5H9V95ZM9.5 95H10V95.5H9.5V95ZM2.5 96H2V96.5H2.5V96ZM3.5 96H3V96.5H3.5V96ZM4 96H4.5V96.5H4V96ZM5.5 96H5V96.5H5.5V96ZM6 96H6.5V96.5H6V96ZM7.5 96H7V96.5H7.5V96ZM8 96H8.5V96.5H8V96ZM9.5 96H9V96.5H9.5V96ZM10 96H10.5V96.5H10V96Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 93H1V93.5H0.5V93ZM1.5 93H2V93.5H1.5V93ZM3 93H2.5V93.5H3V93ZM3.5 93H4V93.5H3.5V93ZM5 93H4.5V93.5H5V93ZM5.5 93H6V93.5H5.5V93ZM7 93H6.5V93.5H7V93ZM7.5 93H8V93.5H7.5V93ZM9 93H8.5V93.5H9V93ZM9.5 93H10V93.5H9.5V93ZM2.5 94H2V94.5H2.5V94ZM3.5 94H3V94.5H3.5V94ZM4 94H4.5V94.5H4V94ZM5.5 94H5V94.5H5.5V94ZM6 94H6.5V94.5H6V94ZM7.5 94H7V94.5H7.5V94ZM8 94H8.5V94.5H8V94ZM9.5 94H9V94.5H9.5V94ZM10 94H10.5V94.5H10V94Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 91H1V91.5H0.5V91ZM1.5 91H2V91.5H1.5V91ZM3 91H2.5V91.5H3V91ZM3.5 91H4V91.5H3.5V91ZM5 91H4.5V91.5H5V91ZM5.5 91H6V91.5H5.5V91ZM7 91H6.5V91.5H7V91ZM7.5 91H8V91.5H7.5V91ZM9 91H8.5V91.5H9V91ZM9.5 91H10V91.5H9.5V91ZM2.5 92H2V92.5H2.5V92ZM3.5 92H3V92.5H3.5V92ZM4 92H4.5V92.5H4V92ZM5.5 92H5V92.5H5.5V92ZM6 92H6.5V92.5H6V92ZM7.5 92H7V92.5H7.5V92ZM8 92H8.5V92.5H8V92ZM9.5 92H9V92.5H9.5V92ZM10 92H10.5V92.5H10V92Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 89H1V89.5H0.5V89ZM1.5 89H2V89.5H1.5V89ZM3 89H2.5V89.5H3V89ZM3.5 89H4V89.5H3.5V89ZM5 89H4.5V89.5H5V89ZM5.5 89H6V89.5H5.5V89ZM7 89H6.5V89.5H7V89ZM7.5 89H8V89.5H7.5V89ZM9 89H8.5V89.5H9V89ZM9.5 89H10V89.5H9.5V89ZM2.5 90H2V90.5H2.5V90ZM3.5 90H3V90.5H3.5V90ZM4 90H4.5V90.5H4V90ZM5.5 90H5V90.5H5.5V90ZM6 90H6.5V90.5H6V90ZM7.5 90H7V90.5H7.5V90ZM8 90H8.5V90.5H8V90ZM9.5 90H9V90.5H9.5V90ZM10 90H10.5V90.5H10V90Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 87H1V87.5H0.5V87ZM1.5 87H2V87.5H1.5V87ZM3 87H2.5V87.5H3V87ZM3.5 87H4V87.5H3.5V87ZM5 87H4.5V87.5H5V87ZM5.5 87H6V87.5H5.5V87ZM7 87H6.5V87.5H7V87ZM7.5 87H8V87.5H7.5V87ZM9 87H8.5V87.5H9V87ZM9.5 87H10V87.5H9.5V87ZM2.5 88H2V88.5H2.5V88ZM3.5 88H3V88.5H3.5V88ZM4 88H4.5V88.5H4V88ZM5.5 88H5V88.5H5.5V88ZM6 88H6.5V88.5H6V88ZM7.5 88H7V88.5H7.5V88ZM8 88H8.5V88.5H8V88ZM9.5 88H9V88.5H9.5V88ZM10 88H10.5V88.5H10V88Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 85H1V85.5H0.5V85ZM1.5 85H2V85.5H1.5V85ZM3 85H2.5V85.5H3V85ZM3.5 85H4V85.5H3.5V85ZM5 85H4.5V85.5H5V85ZM5.5 85H6V85.5H5.5V85ZM7 85H6.5V85.5H7V85ZM7.5 85H8V85.5H7.5V85ZM9 85H8.5V85.5H9V85ZM9.5 85H10V85.5H9.5V85ZM2.5 86H2V86.5H2.5V86ZM3.5 86H3V86.5H3.5V86ZM4 86H4.5V86.5H4V86ZM5.5 86H5V86.5H5.5V86ZM6 86H6.5V86.5H6V86ZM7.5 86H7V86.5H7.5V86ZM8 86H8.5V86.5H8V86ZM9.5 86H9V86.5H9.5V86ZM10 86H10.5V86.5H10V86Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 83H1V83.5H0.5V83ZM1.5 83H2V83.5H1.5V83ZM3 83H2.5V83.5H3V83ZM3.5 83H4V83.5H3.5V83ZM5 83H4.5V83.5H5V83ZM5.5 83H6V83.5H5.5V83ZM7 83H6.5V83.5H7V83ZM7.5 83H8V83.5H7.5V83ZM9 83H8.5V83.5H9V83ZM9.5 83H10V83.5H9.5V83ZM2.5 84H2V84.5H2.5V84ZM3.5 84H3V84.5H3.5V84ZM4 84H4.5V84.5H4V84ZM5.5 84H5V84.5H5.5V84ZM6 84H6.5V84.5H6V84ZM7.5 84H7V84.5H7.5V84ZM8 84H8.5V84.5H8V84ZM9.5 84H9V84.5H9.5V84ZM10 84H10.5V84.5H10V84Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 81H1V81.5H0.5V81ZM1.5 81H2V81.5H1.5V81ZM3 81H2.5V81.5H3V81ZM3.5 81H4V81.5H3.5V81ZM5 81H4.5V81.5H5V81ZM5.5 81H6V81.5H5.5V81ZM7 81H6.5V81.5H7V81ZM7.5 81H8V81.5H7.5V81ZM9 81H8.5V81.5H9V81ZM9.5 81H10V81.5H9.5V81ZM2.5 82H2V82.5H2.5V82ZM3.5 82H3V82.5H3.5V82ZM4 82H4.5V82.5H4V82ZM5.5 82H5V82.5H5.5V82ZM6 82H6.5V82.5H6V82ZM7.5 82H7V82.5H7.5V82ZM8 82H8.5V82.5H8V82ZM9.5 82H9V82.5H9.5V82ZM10 82H10.5V82.5H10V82Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 79H1V79.5H0.5V79ZM1.5 79H2V79.5H1.5V79ZM3 79H2.5V79.5H3V79ZM3.5 79H4V79.5H3.5V79ZM5 79H4.5V79.5H5V79ZM5.5 79H6V79.5H5.5V79ZM7 79H6.5V79.5H7V79ZM7.5 79H8V79.5H7.5V79ZM9 79H8.5V79.5H9V79ZM9.5 79H10V79.5H9.5V79ZM2.5 80H2V80.5H2.5V80ZM3.5 80H3V80.5H3.5V80ZM4 80H4.5V80.5H4V80ZM5.5 80H5V80.5H5.5V80ZM6 80H6.5V80.5H6V80ZM7.5 80H7V80.5H7.5V80ZM8 80H8.5V80.5H8V80ZM9.5 80H9V80.5H9.5V80ZM10 80H10.5V80.5H10V80Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.5 77H1V77.5H0.5V77ZM1.5 77H2V77.5H1.5V77ZM3 77H2.5V77.5H3V77ZM3.5 77H4V77.5H3.5V77ZM5 77H4.5V77.5H5V77ZM5.5 77H6V77.5H5.5V77ZM7 77H6.5V77.5H7V77ZM7.5 77H8V77.5H7.5V77ZM9 77H8.5V77.5H9V77ZM9.5 77H10V77.5H9.5V77ZM2.5 78H2V78.5H2.5V78ZM3.5 78H3V78.5H3.5V78ZM4 78H4.5V78.5H4V78ZM5.5 78H5V78.5H5.5V78ZM6 78H6.5V78.5H6V78ZM7.5 78H7V78.5H7.5V78ZM8 78H8.5V78.5H8V78ZM9.5 78H9V78.5H9.5V78ZM10 78H10.5V78.5H10V78Z"
          fill="black"
        />
      </g>
    </g>
  </Box>
);

const Frame = () => (
  <Box
    as="svg"
    width={phoneFrameMaxWidth}
    viewBox={`0 0 ${phoneFrameMaxWidth} ${phoneFrameMaxHeight}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    id="phone-frame"
    css={{
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      maxWidth: "100%",
    }}>
    <g clipPath="url(#clip0)">
      <path
        d="M57 392.5H109.5C109.5 393.052 109.948 393.5 110.5 393.5H139.5C140.052 393.5 140.5 393.052 140.5 392.5H174C174 393.052 174.448 393.5 175 393.5H234C234.552 393.5 235 393.052 235 392.5H252C252.276 392.5 252.5 392.724 252.5 393C252.5 393.276 252.724 393.5 253 393.5H312.5C312.776 393.5 313 393.276 313 393C313 392.724 313.224 392.5 313.5 392.5H731C762.48 392.5 788 366.98 788 335.5V254.5C788 223.02 788 197.5 788 197.5H1.14441e-05C1.14441e-05 197.5 0 201.52 0 233V335.5C0 366.98 25.5198 392.5 57 392.5Z"
        fill="#F2F2F2"
      />
      <path
        d="M184.5 2.5H57C25.5198 2.5 0 28.0198 0 59.5V140.5C0 171.98 0 197.5 0 197.5H788C788 197.5 788 171.98 788 140.5V59.5C788 28.0198 762.48 2.5 731 2.5H278.5V1C278.5 0.447715 278.052 0 277.5 0H185.5C184.948 0 184.5 0.447715 184.5 1V2.5Z"
        fill="#F2F2F2"
      />
      <path
        d="M729 13.25H59C32.0761 13.25 10.25 35.0761 10.25 62V333C10.25 359.924 32.0761 381.75 59 381.75H729C755.924 381.75 777.75 359.924 777.75 333V62C777.75 35.0761 755.924 13.25 729 13.25Z"
        fill="white"
        stroke="#C4C4C4"
        strokeWidth="0.5"
      />
      <path
        d="M727 26H61C40.5655 26 24 42.5655 24 63V332C24 352.435 40.5655 369 61 369H727C747.435 369 764 352.435 764 332V63C764 42.5655 747.435 26 727 26Z"
        fill="#EFEFEF"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <rect width="788" height="394" fill="white" />
      </clipPath>
    </defs>
  </Box>
);

const PhoneSvg = forwardRef((_, ref: React.Ref<HTMLDivElement>) => (
  <Box
    ref={ref}
    css={{
      width: "100%",
      maxWidth: phoneFrameMaxWidth,
      mx: "auto",
    }}>
    <Box
      css={{
        position: "relative",
        height: 0,
        width: "100%",
        maxWidth: phoneFrameMaxWidth,
        pb: phoneAspectRatio,
      }}>
      <Notch />
      <Frame />
    </Box>
  </Box>
));
export default PhoneSvg;
export { Notch, Frame };
