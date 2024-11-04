import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// contentId can be passed either a post or reply id
export const DropdownDelete = ({ onDelete, contentId, contentType }) => {
    return (
        <div className="dropdown">
            <button
                className="btn btn-link p-0 text-muted"
                id={`dropdownMenuButton-${contentType}-${contentId}`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ fontSize: '1.5rem', lineHeight: 1 }}
            >
                <i className="bi bi-three-dots"></i>
            </button>
            <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby={`dropdownMenuButton-${contentId}`}
            >
                <li>
                    <button
                        className="dropdown-item text-danger"
                        onClick={() => {
                            //event.stopPropagation(); // Prevent click from reaching card
                            onDelete(contentId)}
                        }
                    >
                        Delete
                    </button>
                </li>
            </ul>
        </div>
    );
};
