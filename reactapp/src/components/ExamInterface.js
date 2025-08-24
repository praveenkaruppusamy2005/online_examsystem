import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../utils/api';
import '../styles/exam.css'; // For Vanilla version only

export default function ExamInterface(props) {
  const locationState = props.location?.state ?? {};
  const { questions = [], exam = {}, studentExamId = '' } = locationState;
  const { studentExamId: idFromUrl } = useParams();
  const sid = studentExamId || idFromUrl || '';
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((exam.duration || 15) * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const current = questions[index] || {};

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (answers[current.questionId]) {
        saveAnswer(current.questionId, answers[current.questionId]);
      }
    }, 30000);
    return () => clearTimeout(autoSave);
  }, [answers, current.questionId]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const selectOption = (opt) => {
    setAnswers(prev => ({ ...prev, [current.questionId]: opt }));
  };

  const saveAnswer = async (qid, selectedOption) => {
    try {
      await api.submitAnswer(sid, qid, selectedOption);
    } catch (err) {
      console.error('Failed to save answer:', err);
    }
  };

  const next = async () => {
    if (answers[current.questionId]) {
      await saveAnswer(current.questionId, answers[current.questionId]);
    }
    if (index < questions.length - 1) setIndex(i => i + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(i => i - 1);
  };

  const goToQuestion = (i) => setIndex(i);

  // Submit all answers before completing exam
  const submitAllAnswers = async () => {
    for (const qid of Object.keys(answers)) {
      await saveAnswer(qid, answers[qid]);
    }
  };

  const handleAutoSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitAllAnswers();
      await api.completeExam(sid);
      navigate(`/student/results/${sid}`);
    } catch (err) {
      console.error('Auto-submit failed:', err);
    }
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitAllAnswers();
      await api.completeExam(sid);
      navigate(`/student/results/${sid}`);
    } catch (err) {
      console.error('Submit failed:', err);
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  if (!current.questionText) {
    return <div className="exam-wrapper"><p>No questions found.</p></div>;
  }

  return (
    <div className="exam-wrapper">
      <div className="exam-header">
        <div>
          <h2>{exam.title || 'Exam'}</h2>
          <p>Question {index + 1} of {questions.length}</p>
          <p>{answeredCount} answered</p>
        </div>
        <div className="exam-timer">{formatTime(timeLeft)}</div>
      </div>

      <div className="exam-content">
        <div className="question-card">
          <div className="question-text">{current.questionText}</div>
          <div className="options-group">
            {['A', 'B', 'C', 'D'].map(opt => (
              <label className="option-card" key={opt}>
                <input
                  type="radio"
                  name={`q-${current.questionId}`}
                  value={opt}
                  checked={answers[current.questionId] === opt}
                  onChange={() => selectOption(opt)}
                />
                {current[`option${opt}`]}
              </label>
            ))}
          </div>

          <div className="exam-controls">
            <button className="exam-button button-nav" onClick={prev} disabled={index === 0}>← Previous</button>
            <button className="exam-button button-nav" onClick={next} disabled={index === questions.length - 1}>Next →</button>
            <button className="exam-button button-submit" onClick={() => setShowSubmitModal(true)} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>

        <div className="navigator">
          <h3>Question Navigator</h3>
          <div className="navigator-grid">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`navigator-button ${i === index ? 'current' : ''} ${answers[questions[i].questionId] ? 'answered' : ''}`}
                onClick={() => goToQuestion(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Submit Exam?</h3>
            <p>You answered {answeredCount} of {questions.length} questions.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setShowSubmitModal(false)} className="exam-button button-nav">Cancel</button>
              <button onClick={confirmSubmit} className="exam-button button-submit">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
