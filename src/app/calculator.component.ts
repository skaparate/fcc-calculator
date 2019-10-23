import { Component, OnInit, AfterViewInit } from '@angular/core';
import { evaluate } from 'mathjs';

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.sass'],
})
export default class Calculator implements OnInit {
  operation: string = '0';
  nums = Array.from(Array(10), (x, i) => i);
  buttons: Array<Object> = [];
  operators: Array<string> = ['-', '+', '*', '/', '%'];
  expr: string = '0';
  result: string = '';

  constructor() {
    let code = [48, 96];
    const names = [
      'zero',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
    ];
    this.nums.forEach(i => {
      this.buttons.push({
        value: i,
        id: names[i],
        code: [code[0], code[1]],
      });
      code[0]++;
      code[1]++;
    });
    this.buttons = this.buttons.reverse();
  }

  ngOnInit() {
    document.addEventListener('keyup', this.handleKeyPress);
  }

  handleNumber(value: string) {
    if (this.result) {
      this.expr = '';
      this.result = '';
      this.operation = '';
    }

    if (this.operation === '0') {
      this.operation = value;
      this.expr = value;
    } else {
      if (this.operation.length >= 1) {
        if (
          this.operation.startsWith('0') &&
          this.operation[1] !== '.' &&
          value === '0'
        ) {
          return;
        }
      }
      this.operation += value;
      this.expr += value;
    }
  }

  handleKeyPress(event: any) {
    const code = event.code;
    console.debug('Event:', event);
    let key: string;

    if (code === 'BracketRight') {
      key = 'plus';
      if (event.shiftKey) {
        key = 'multiply';
      }
    } else if (code === 'Digit5' && event.shiftKey) {
      key = 'mod';
    } else {
      key = code.toLowerCase().replace(/(numpad|digit|key)/, '');
    }

    const element: HTMLElement = document.querySelector(
      `.calculator-button--${key}`
    );

    if (element) {
      element.classList.add('active');
      element.click();
      const handle = setTimeout(() => {
        element.classList.remove('active');
        clearTimeout(handle);
      }, 100);
    }
  }

  clear(clearResult = true) {
    this.operation = '0';
    this.expr = '0';
    if (clearResult) {
      this.result = '';
    }
  }

  onClearAll() {
    this.clear();
  }

  onButtonClick(event: any) {
    const value = event.target.value;
    console.debug('Button value:', value);
    this.handleNumber(value);
  }

  /**
   * Handles the operator button clicks.
   *
   * @param event The event sent from the button.
   */
  onOperatorClick(event: any) {
    const value = event.target.value;
    console.debug('Operator click:', value);

    if (this.result) {
      this.expr = this.result;
      this.result = '';
    }

    const canAdd = this.canAddOperator(value);

    if (canAdd === 1) {
      console.debug('Appending operator');
      this.expr += value;
    } else if (canAdd === 0) {
      console.debug('Replacing operator');
      this.expr = this.expr.slice(0, -1) + value;
    } else {
      this.expr = this.expr.slice(0, -2) + value;
    }

    this.operation = value;
  }

  /**
   * Handles the decimal button click.
   */
  onDecimalClick() {
    const dot = '.';
    if (this.operation.includes(dot)) {
      return;
    }
    this.operation += dot;
    this.expr += dot;
  }

  /**
   * Handles the equals button click.
   */
  onEqualsClick() {
    this.operation = '';
    this.expr = this.expr.replace(/(\s+[\-+\/\*%]\s+$|(=\d+))/, '');
    this.result = evaluate(this.expr);
    this.expr = `${this.expr}=${this.result}`;
    this.operation = this.result;
  }

  /**
   * Handles the delete button click.
   */
  onDelClick() {
    // Disable the delete action if there is an equal sign
    if (this.expr.indexOf('=') >= 0) {
      return;
    }
    // Remove the last character of the current operation, if any.
    if (this.operation.length > 0) {
      this.operation = this.operation.slice(0, -1);
    }
    if (this.expr.length > 0) {
      // Remove the last character of the expression
      this.expr = this.expr.slice(0, -1);
      if (this.expr.length === 0) {
        // If the expression is empty, clear all.
        this.clear(false);
      }
    }
  }

  /**
   * Checks if the operator can be added or not.
   * Restrictions:
   *
   * - No more than two consecutive operators
   * - The only operator that can be repeated twice is minus
   * - Any operator can be followed by the minus.
   * @param val The val to check.
   */
  canAddOperator(val: string): number {
    const lastExpression = this.expr[this.expr.length - 1];
    const lastIsOperator = this.isOperator(lastExpression);

    if (!lastIsOperator) {
      return 1;
    }

    if (val === '-') {
      if (lastIsOperator && !this.isOperator(this.expr[this.expr.length - 2])) {
        return 1;
      }
    }

    return this.isOperator(this.expr[this.expr.length - 2]) ? -1 : 0;
  }

  /**
   * Checks if a string is a operator.
   *
   * @param operator The string to check.
   */
  isOperator(operator: string) {
    return this.operators.includes(operator);
  }
}
