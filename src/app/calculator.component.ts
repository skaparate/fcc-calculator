import { Component, OnInit, AfterViewInit } from '@angular/core';
import { evaluate } from 'mathjs';

@Component({
  selector: 'calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.sass'],
})
export default class Calculator implements AfterViewInit {
  operation: string = '0';
  nums = Array.from(Array(10), (x, i) => i);
  buttons: Array<Object> = [];
  operators: Array<string> = ['-', '+', '*', '/'];
  negate = false;
  expr: string = '0';
  result: string = '';

  constructor() {
    this.buttons.push({
      value: 0,
      id: 'zero',
    });
    this.buttons.push({
      value: 1,
      id: 'one',
    });
    this.buttons.push({
      value: 2,
      id: 'two',
    });
    this.buttons.push({
      value: 3,
      id: 'three',
    });
    this.buttons.push({
      value: 4,
      id: 'four',
    });
    this.buttons.push({
      value: 5,
      id: 'five',
    });
    this.buttons.push({
      value: 6,
      id: 'six',
    });
    this.buttons.push({
      value: 7,
      id: 'seven',
    });
    this.buttons.push({
      value: 8,
      id: 'eight',
    });
    this.buttons.push({
      value: 9,
      id: 'nine',
    });
    this.buttons = this.buttons.reverse();
  }

  ngAfterViewInit() {}

  clear(clearResult = true) {
    this.operation = '0';
    this.expr = '0';
    if (clearResult) {
      this.result = '';
    }
  }

  onClear() {
    this.clear();
  }

  onButtonClick(event: any) {
    const value = event.target.value;
    console.debug('Button value:', value);

    if (this.result) {
      this.expr = '';
      this.result = '';
    }

    if (this.operation === '0') {
      this.operation = value;
      this.expr = value;
    } else {
      this.operation += value;
      this.expr += value;
    }
  }

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

  onDecimalClick() {
    const dot = '.';
    if (this.operation.includes(dot)) {
      return;
    }
    this.operation += dot;
    this.expr += dot;
  }

  onEqualsClick() {
    this.operation = '';
    this.expr = this.expr.replace(/(\s+[\-+\/\*]\s+$|(=\d+))/, '');
    this.result = evaluate(this.expr);
    this.expr = `${this.expr}=${this.result}`;
    this.operation = this.result;
  }

  onNegate() {
    if (this.operation.startsWith('-')) {
      this.operation = this.operation.replace('-', '');
      this.negate = false;
    } else {
      this.operation = '-' + this.operation;
      this.negate = true;
    }
  }

  onDelClick() {
    if (this.expr.length > 0) {
      this.expr = this.expr.slice(0, -1);
      this.operation = '';
      if (this.expr.length === 0) {
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

  isOperator(operator: string) {
    return this.operators.includes(operator);
  }
}
