// src/hooks/useSeasonManagement.ts
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { PlaceFormValues } from '@/types/contribute';

interface UseSeasonManagementProps {
  setValue: UseFormSetValue<PlaceFormValues>;
  watch: UseFormWatch<PlaceFormValues>;
}

export function useSeasonManagement({ setValue, watch }: UseSeasonManagementProps) {
  const selectedSeasons = watch('seasonTags');

  const toggleSeason = (season: string) => {
    const newSeasons = selectedSeasons.includes(season)
      ? selectedSeasons.filter(s => s !== season)
      : [...selectedSeasons, season];
    setValue('seasonTags', newSeasons);
  };

  return {
    selectedSeasons,
    toggleSeason
  };
}
