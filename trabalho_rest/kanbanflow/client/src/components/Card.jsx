import { useDraggable } from '@dnd-kit/core';

function Card({ card, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: card.id,
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: '#fff',
    borderRadius: '6px',
    padding: '8px 12px',
    marginBottom: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    cursor: 'grab',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <span>{card.title}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
      >
        ✕
      </button>
    </div>
  );
}

export default Card;