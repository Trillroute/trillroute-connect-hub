
import { useState, useEffect } from 'react';

export function useLevelPermissions(
  canAddLevel: boolean = true,
  canEditLevel: boolean = true,
  canDeleteLevel: boolean = true
) {
  // Effect for setting effective permissions
  const [effectiveCanAdd, setEffectiveCanAdd] = useState(canAddLevel);
  const [effectiveCanEdit, setEffectiveCanEdit] = useState(canEditLevel);
  const [effectiveCanDelete, setEffectiveCanDelete] = useState(canDeleteLevel);

  useEffect(() => {
    setEffectiveCanAdd(canAddLevel);
    setEffectiveCanEdit(canEditLevel);
    setEffectiveCanDelete(canDeleteLevel);
  }, [canAddLevel, canEditLevel, canDeleteLevel]);

  return {
    effectiveCanAdd,
    effectiveCanEdit,
    effectiveCanDelete
  };
}
