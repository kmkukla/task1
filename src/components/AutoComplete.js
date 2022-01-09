import { useState } from 'react';
import styles from './AutoComplete.module.css';

const AutoComplete = ({ suggestions }) => {
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isKeyReleased, setIsKeyReleased] = useState(false);

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const onChange = (e) => {
    const { value } = e.target;
    const filteredSuggesionsList = suggestions.filter(
      (suggestion) => suggestion.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    setInput(value);
    setFilteredSuggestions(filteredSuggesionsList);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);
  };

  const onKeyDown = (e) => {
    const { key } = e;
    const trimmedInput = input.trim();

    if (key === 'ArrowUp') {
      if (activeSuggestionIndex < 0) return;
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    }

    if (key === 'ArrowDown') {
      if (activeSuggestionIndex === filteredSuggestions.length - 1) return;
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }

    if (
      key === 'Enter' &&
      (trimmedInput.length || filteredSuggestions.length)
    ) {
      e.preventDefault();
      setTags((prevState) => [
        ...prevState,
        !filteredSuggestions.length || activeSuggestionIndex === -1
          ? trimmedInput
          : filteredSuggestions[activeSuggestionIndex],
      ]);
      setInput('');
    }

    if (key === 'Backspace' && !input.length && tags.length && isKeyReleased) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag);
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const deleteTag = (index) => {
    setTags((prevState) => prevState.filter((tag, i) => i !== index));
  };

  const onClick = (e) => {
    setTags((prevState) => [...prevState, e.target.innerText]);
    setInput('');
    setFilteredSuggestions([]);
    setActiveSuggestionIndex(0);
    setShowSuggestions(false);
  };

  return (
    <>
      <div className={styles.container}>
        {tags.map((tag, index) => (
          <div className={styles.tag} key={tag}>
            {tag}
            <button onClick={() => deleteTag(index)}>x</button>
          </div>
        ))}
        <input
          value={input}
          placeholder="Enter a programming language"
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onChange={onChange}
        />
      </div>
      {showSuggestions &&
        input &&
        (filteredSuggestions.length ? (
          <ul className={styles.suggestions}>
            {filteredSuggestions.map((suggestion, index) => {
              let className;
              if (index === activeSuggestionIndex) {
                className = styles.suggestionActive;
              }
              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={styles.noSuggestions}>
            <em>Language not found. You can still add it.</em>
          </div>
        ))}
    </>
  );
};

export default AutoComplete;
