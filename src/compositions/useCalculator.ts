import { computed, reactive, ref, watch } from "vue";
import { Formula } from "../lib/formula";

export type Command = typeof buttonLabels[number];

// prettier-ignore
const buttonLabels = [
  "C", "+-", "%", "/",
  "7", "8", "9", "X",
  "4", "5", "6", "-",
  "1", "2", "3", "+",
  "0", ".", "="
] as const

/**
 * 計算コマンドと現在の式を渡して新しい式を生成する
 */
function runCommand(
  currentValue: string,
  command: Command,
  formula: Formula
): string {
  switch (command) {
    case "C":
      formula.clear();
      return formula.currentValue();
    case "+-":
      formula.inverse();
      return formula.currentValue();
    case "%":
      formula.transToPercentage();
      return formula.currentValue();
    case "/":
    case "X":
    case "-":
    case "+":
      if (formula.operator) {
        formula.clear(Number(formula.calc()));
        formula.setOperator(command);
      } else {
        formula.setLeftValue(currentValue);
        formula.setOperator(command);
      }
      return formula.currentValue();
    case ".":
      formula.appendPoint();
      return formula.currentValue();
    case "=":
      const answer = formula.calc();
      formula.clear();
      return answer;
    default:
      // 0,1,2,3,4,5,6,7,8,9
      formula.appendValue(command);
      return formula.currentValue();
  }
}

export default function useCalculator() {
  type State = { currentValue: string; formula: Formula };
  const state = ref<State>({
    currentValue: "0",
    formula: new Formula(),
  });
  const sendCommand = (command: Command) => {
    state.value.currentValue = runCommand(
      state.value.currentValue,
      command,
      state.value.formula
    );
  };
  return { state, sendCommand, buttonLabels };
}
