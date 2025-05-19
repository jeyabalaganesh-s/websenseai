import React, { useState } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";

// ✅ Global Styles to Force Dark Theme
const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: #121212 !important;
    color: white !important;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
`;

const FeedbackContainer = styled.div`
  background-color: #1f1f1f;
  color: white;
  padding: 30px;
  border-radius: 10px;
  width: 50%;
  margin: 50px auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h2`
  text-align: center;
  color: cyan;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #333;
  background: #222;
  color: white;
  border-radius: 5px;
  &:focus {
    outline: none;
    border-color: cyan;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #333;
  background: #222;
  color: white;
  border-radius: 5px;
  &:focus {
    outline: none;
    border-color: cyan;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #333;
  background: #222;
  color: white;
  border-radius: 5px;
  &:focus {
    outline: none;
    border-color: cyan;
  }
`;

const SubmitButton = styled.button`
  padding: 14px;
  background: cyan;
  color: black;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background: #00bcd4;
  }
`;

const Message = styled.div`
  text-align: center;
  padding: 12px;
  border-radius: 5px;
  margin-top: 15px;
  ${({ isError }) => (isError ? "background: red;" : "background: green;")}
`;

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    feedback: "",
    rating: "5",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [sentiment, setSentiment] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSentiment("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/submit-feedback",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setMessage(response.data.message);
      setSentiment(response.data.sentiment);
      setIsError(false);
      setFormData({ name: "", email: "", website: "", feedback: "", rating: "5" });
    } catch (error) {
      console.error("❌ Feedback Submission Error:", error.response?.data || error.message);
      setMessage("Error submitting feedback. Please try again.");
      setIsError(true);
    }
  };

  return (
    <>
      <GlobalStyle />
      <FeedbackContainer>
        <Title>Website Feedback Form</Title>
        {message && <Message isError={isError}>{message}</Message>}
        {sentiment && <Message>Sentiment: {sentiment}</Message>}
        <StyledForm onSubmit={handleSubmit}>
          <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required />
          <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" required />
          <Input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="Website URL" required />
          <Textarea name="feedback" value={formData.feedback} onChange={handleChange} rows="4" placeholder="Your Feedback" required />
          <Select name="rating" value={formData.rating} onChange={handleChange} required>
            <option value="1">⭐ 1 - Poor</option>
            <option value="2">⭐⭐ 2 - Fair</option>
            <option value="3">⭐⭐⭐ 3 - Good</option>
            <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
          </Select>
          <SubmitButton type="submit">Submit Feedback</SubmitButton>
        </StyledForm>
      </FeedbackContainer>
    </>
  );
};

export default Feedback;