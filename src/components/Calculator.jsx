import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, History, Trash2, Code2, RotateCcw } from 'lucide-react';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [history, setHistory] = useState([]);
  const [prevVal, setPrevVal] = useState(null);
  const [operation, setOperation] = useState(null);
  const [awaitingNext, setAwaitingNext] = useState(false);

  // Handle digit inputs
  const inputDigit = (digit) => {
    if (awaitingNext) {
      setDisplay(String(digit));
      setAwaitingNext(false);
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
    }
  };

  // Handle decimal point
  const inputDecimal = () => {
    if (awaitingNext) {
      setDisplay('0.');
      setAwaitingNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  // Handle operators
  const handleOperator = (nextOp) => {
    const inputVal = parseFloat(display);

    if (prevVal === null) {
      setPrevVal(inputVal);
      setEquation(`${inputVal} ${nextOp}`);
    } else if (operation) {
      const currentVal = prevVal;
      const result = calculate(currentVal, inputVal, operation);

      if (result === 'Error') {
        setDisplay('Error');
        setPrevVal(null);
        setOperation(null);
        setEquation('');
        return;
      }

      setPrevVal(result);
      setDisplay(String(result));
      setEquation(`${result} ${nextOp}`);
    }

    setAwaitingNext(true);
    setOperation(nextOp);
  };

  // Pure calculation function
  const calculate = (first, second, op) => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '×': return first * second;
      case '÷': 
        if (second === 0) return 'Error';
        return parseFloat((first / second).toFixed(8));
      default: return second;
    }
  };

  // Execute calculation
  const handleEquals = () => {
    if (operation === null || prevVal === null) return;

    const currentVal = parseFloat(display);
    const result = calculate(prevVal, currentVal, operation);

    if (result === 'Error') {
      setDisplay('Error (Div by 0)');
      setEquation('');
      setPrevVal(null);
      setOperation(null);
      setAwaitingNext(true);
      return;
    }

    const newHistoryEntry = {
      eq: `${prevVal} ${operation} ${currentVal}`,
      res: result,
      time: new Date().toLocaleTimeString()
    };

    setHistory(prev => [newHistoryEntry, ...prev.slice(0, 9)]);
    setEquation(`${prevVal} ${operation} ${currentVal} =`);
    setDisplay(String(result));
    setPrevVal(null);
    setOperation(null);
    setAwaitingNext(true);
  };

  // Clear all
  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setPrevVal(null);
    setOperation(null);
    setAwaitingNext(false);
  };

  // Delete last character
  const handleBackspace = () => {
    if (awaitingNext) return;
    if (display.length === 1 || display === 'Error') {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  // Toggle plus / minus sign
  const handleNegate = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay(String(-val));
    }
  };

  // Percentage
  const handlePercentage = () => {
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay(String(val / 100));
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') inputDigit(parseInt(e.key, 10));
      if (e.key === '.') inputDecimal();
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('×');
      if (e.key === '/') { e.preventDefault(); handleOperator('÷'); }
      if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handleEquals(); }
      if (e.key === 'Backspace') handleBackspace();
      if (e.key === 'Escape') handleClear();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevVal, operation, awaitingNext]);

  return (
    <div className="container" style={{ marginTop: '2rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalcIcon size={24} color="var(--primary)" /> React Fundamentals Calculator
        </h1>
        <p style={{ fontSize: '0.88rem' }}>
          Demonstrates React JS state hooks (<code>useState</code>, <code>useEffect</code>), event dispatching, component hierarchy, and defensive validation.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
        {/* Calculator Widget */}
        <div className="card" style={{ maxWidth: '400px', margin: '0 auto', width: '100%', padding: '1.5rem', background: '#0f172a', border: '2px solid rgba(99, 102, 241, 0.3)' }}>
          {/* Calculator Display Screen */}
          <div style={{ background: '#020617', padding: '16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'right', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', minHeight: '18px', fontFamily: 'var(--font-mono)' }}>
              {equation || '\u00A0'}
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff', letterSpacing: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {display}
            </div>
          </div>

          {/* Keypad Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {/* Row 1 */}
            <button type="button" className="btn btn-secondary" style={{ background: '#334155', color: '#fca5a5' }} onClick={handleClear}>C</button>
            <button type="button" className="btn btn-secondary" style={{ background: '#334155' }} onClick={handleBackspace}>DEL</button>
            <button type="button" className="btn btn-secondary" style={{ background: '#334155' }} onClick={handlePercentage}>%</button>
            <button type="button" className="btn btn-primary" onClick={() => handleOperator('÷')}>÷</button>

            {/* Row 2 */}
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(7)}>7</button>
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(8)}>8</button>
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(9)}>9</button>
            <button type="button" className="btn btn-primary" onClick={() => handleOperator('×')}>×</button>

            {/* Row 3 */}
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(4)}>4</button>
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(5)}>5</button>
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(6)}>6</button>
            <button type="button" className="btn btn-primary" onClick={() => handleOperator('-')}>-</button>

            {/* Row 4 */}
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(1)}>1</button>
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(2)}>2</button>
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(3)}>3</button>
            <button type="button" className="btn btn-primary" onClick={() => handleOperator('+')}>+</button>

            {/* Row 5 */}
            <button type="button" className="btn btn-secondary" onClick={handleNegate}>±</button>
            <button type="button" className="btn btn-secondary" onClick={() => inputDigit(0)}>0</button>
            <button type="button" className="btn btn-secondary" onClick={inputDecimal}>.</button>
            <button type="button" className="btn btn-accent" style={{ fontWeight: 800 }} onClick={handleEquals}>=</button>
          </div>
        </div>

        {/* Calculation History & React Concepts Annotation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* History Panel */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <History size={16} color="var(--primary)" /> Calculation Memory Log
              </h3>
              {history.length > 0 && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                  onClick={() => setHistory([])}
                >
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {history.length === 0 ? (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textAlign: 'center', padding: '1rem' }}>
                  No previous calculations in session.
                </div>
              ) : (
                history.map((h, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      background: 'rgba(255,255,255,0.03)', 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      fontSize: '0.82rem'
                    }}
                  >
                    <div>
                      <div style={{ color: 'var(--text-muted)' }}>{h.eq}</div>
                      <div style={{ fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>= {h.res}</div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '2px 8px', fontSize: '0.72rem' }}
                      onClick={() => setDisplay(String(h.res))}
                    >
                      Use
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Academic Annotation Panel */}
          <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', marginBottom: '8px' }}>
              <Code2 size={16} /> Web Syllabus: React Concepts Demonstrated
            </h3>
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '1.2rem' }}>
              <li><strong>State Management:</strong> Multiple interconnected <code>useState</code> hooks managing operand, operator, display buffer, and history array.</li>
              <li><strong>Defensive Parsing:</strong> Safe mathematical evaluations preventing floating-point drift and division by zero.</li>
              <li><strong>Synthetic Event Handling:</strong> Declarative button click callbacks and window-level keyboard accessibility via <code>useEffect</code>.</li>
              <li><strong>Conditional Rendering:</strong> Dynamic equations, empty-state history placeholders, and error badges.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
