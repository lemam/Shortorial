import { Modal, Button } from "react-bootstrap";
import React from "react";

interface ModalType {
  title: string;
  body: React.ReactNode;
  showModal: boolean;
  handleCloseModal: () => void;
  goToLearnMode: () => void;
  goToChallengeMode: () => void;
}

const ModalComponent = ({
  title,
  body,
  showModal,
  handleCloseModal,
  goToLearnMode,
  goToChallengeMode,
}: ModalType) => {
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
