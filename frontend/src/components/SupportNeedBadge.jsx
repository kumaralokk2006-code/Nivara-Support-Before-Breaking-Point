import React from 'react';

const SupportNeedBadge = ({ level = 'LOW', label }) => {
  const normalized = (level || 'LOW').toUpperCase();

  let className = 'badge badge-low';
  if (normalized === 'MILD') className = 'badge badge-mild';
  if (normalized === 'MODERATE') className = 'badge badge-moderate';
  if (normalized === 'HIGH') className = 'badge badge-high';

  return (
    <span className={className}>
      {label ? `${label}: ${normalized}` : normalized}
    </span>
  );
};

export default SupportNeedBadge;
