import React, { useEffect, useReducer, useRef } from "react";
import slides from "./slide";

const SLIDE_DURATION = 3000;

function Slides({ children }) {
  return <ul>{children}</ul>;
}

function Slide({ isCurrent, takeFocus, image, id, title, content }) {
  const ref = useRef();

  useEffect(() => {
    if (isCurrent && takeFocus) {
      ref.current.focus();
    }
  }, [isCurrent, takeFocus]);

  return (
    <li
      ref={ref}
      aria-hidden={!isCurrent}
      tabIndex="-1"
      aria-labelledby="id"
      className="Slide"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="SlideContent">
        <h2 id={id} style={{ marginBottom: "2rem" }}>
          {title}
        </h2>
        <p>{content}</p>
      </div>
    </li>
  );
}

function SlideNav({ children }) {
  return <ul className="SlideNav">{children}</ul>;
}

function SlideNavItem({ isCurrent, ...props }) {
  return (
    <li className="SlideNavItem">
      <button {...props} aria-current={isCurrent}>
        <span />
      </button>
    </li>
  );
}

function Controls({ children }) {
  return <div className="Controls">{children}</div>;
}

function IconButton({ children, ...props }) {
  return (
    <button {...props} className="IconButton">
      {children}
    </button>
  );
}

function Carousel({ children }) {
  return <section className="Carousel">{children}</section>;
}

function App() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "PROGRESS":
        case "NEXT":
          return {
            ...state,
            takeFocus: false,
            currentIndex: (state.currentIndex + 1) % slides.length,
          };
        case "PREV":
          return {
            ...state,
            takeFocus: false,
            currentIndex:
              (state.currentIndex - 1 + slides.length) % slides.length,
          };
        case "PLAY":
          return {
            ...state,
            takeFocus: false,
            isPlaying: true,
          };
        case "PAUSE":
          return {
            ...state,
            takeFocus: false,
            isPlaying: false,
          };
        case "GOTO":
          return {
            ...state,
            takeFocus: true,
            currentIndex: action.index,
          };
        default:
          return state;
      }
    },
    {
      currentIndex: 0,
      isPlaying: false,
      takeFocus: false,
    }
  );

  useEffect(() => {
    if (state.isPlaying) {
      let timeout = setTimeout(() => {
        dispatch({ type: "PROGRESS" });
      }, SLIDE_DURATION);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [state.currentIndex, state.isPlaying]);

  return (
    <div>
      <Carousel>
        <Slides>
          {slides.map((image, index) => (
            <Slide
              key={index}
              id={`image-${index}`}
              isCurrent={index === state.currentIndex}
              image={image.img}
              title={image.title}
              content={image.content}
              takeFocus={state.takeFocus}
            />
          ))}
        </Slides>

        <SlideNav>
          {slides.map((slide, index) => (
            <SlideNavItem
              aria-label={`Slide ${index}`}
              key={index}
              isCurrent={index === state.currentIndex}
              onClick={() => dispatch({ type: "GOTO", index })}
            />
          ))}
        </SlideNav>

        <Controls>
          {state.isPlaying ? (
            <IconButton
              onClick={() => dispatch({ type: "PAUSE" })}
              aria-label="Pause"
            >
              Pause
            </IconButton>
          ) : (
            <IconButton
              onClick={() => dispatch({ type: "PLAY" })}
              aria-label="Play"
            >
              Play
            </IconButton>
          )}

          <IconButton
            onClick={() => {
              dispatch({ type: "PREV" });
            }}
            aria-label="Prev Slide"
          >
            Prev
          </IconButton>
          <IconButton
            onClick={() => {
              dispatch({ type: "NEXT" });
            }}
            aria-label="Next Slide"
          >
            Next
          </IconButton>
        </Controls>
      </Carousel>
    </div>
  );
}

export default App;
