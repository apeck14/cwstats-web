import styled from "styled-components"

import { errorRed, gray, orange, pink } from "../../public/static/colors"
import LoadingSpinner from "../LoadingSpinner"

const ModalWrapper = styled.div`
  position: fixed;
  bottom: ${({ $isOpen }) => ($isOpen ? "0.5rem" : 0)};
  display: flex;
  align-items: center;
  justify-content: center;
  width: inherit;
  margin: 0 auto;
  transform: translateY(${({ $isOpen }) => ($isOpen ? "0%" : "100%")});
  transition: transform 0.1s ease-out;
`

const Modal = styled.div`
  background-color: ${gray["100"]};
  color: ${gray["0"]};
  padding: 1rem;
  border-radius: 0.3125rem;
  width: 100%;
  box-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.2);
`

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`

const Text = styled.p`
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

const SaveButton = styled.button`
  background-color: ${pink};
  color: ${gray["0"]};
  padding: 0.5rem 0;
  min-width: 4rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: ${orange};
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    min-width: 3.5rem;
  }
`

const Error = styled.p`
  color: ${errorRed};
  float: right;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`

export default function UnsavedChangesModal({ error, isLoading, isOpen, onSave }) {
  return (
    <ModalWrapper $isOpen={isOpen}>
      <Modal>
        <Content>
          <Text>You have unsaved changes. Would you like to save these changes?</Text>
          <SaveButton onClick={onSave}>
            {isLoading ? <LoadingSpinner lineWidth={2} size="0.75rem" /> : "Save"}
          </SaveButton>
        </Content>

        {error && <Error>{error}</Error>}
      </Modal>
    </ModalWrapper>
  )
}
