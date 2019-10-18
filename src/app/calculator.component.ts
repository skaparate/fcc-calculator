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
  expression: Array<string> = [];
  lastOperation: string = '';
  operators: Array<string> = ['-', '+', '*', '/'];
  negate = false;

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

  updateOperation(operand: string) {
    console.debug('Operand:', operand);
    this.operation += operand;
  }

  onClear() {
    this.operation = '0';
    this.expression = [];
    this.lastOperation = '';
  }

  onButtonClick(event: any) {
    const value = event.target.value;
    if (this.operation === '0') {
      this.operation = value;
      console.debug('Expression:', this.expression);
      return;
    }
    if (this.negate === false && this.isOperator(this.operation)) {
      console.debug('Current operation:', this.operation);
      this.operation = '';
    }
    this.operation += value;
    console.debug('Expression:', this.expression);
  }

  onOperatorClick(event: any) {
    console.debug('Event:', event);
    const operator = event.target.value;
    console.debug('Operator:', operator);
    const lastIndex = this.expression.length - 1 || 0;
    this.expression.push(this.operation);

    if (this.isOperator(this.expression[lastIndex])) {
      this.expression[lastIndex] = operator;
    } else {
      this.expression.push(operator);
    }

    this.operation = operator;
    console.debug('Expression:', this.expression);
  }

  onDecimalClick() {
    const dot = '.';
    if (this.operation.includes(dot)) {
      return;
    }
    this.updateOperation(dot);
  }

  onEqualsClick() {
    if (!this.isOperator(this.operation)) {
      this.expression.push(this.operation);
      this.operation = '';
    }
    this.updateResult();
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

  updateResult() {
    console.debug('Entering updateResult');
    console.debug('Expression:', this.expression);
    this.operation = evaluate(this.expression.join('')).toString();
    this.expression = [];
    console.debug('Updated expression:', this.expression);
    console.debug('Leaving updateResult');
  }

  isOperator(operator: string) {
    return this.operators.includes(operator);
  }
}
