import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React from "react";

interface ModalType {
  title: string;
  body: React.ReactNode;
  showModal: boolean;
  handleCloseModal: () => void;
}

const ModalComponent = ({ title, body, showModal, handleCloseModal }: ModalType) => {
  const navigate = useNavigate();

  const goToLearnMode = () => {
    navigate("/learn");
  };
  const goToChallengeMode = () => {
    navigate("/challenge");
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={goToLearnMode}>
          연습 모드
        </Button>
        <Button variant="primary" onClick={goToChallengeMode}>
          챌린지 모드
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
