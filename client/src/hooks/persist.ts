import {
  CHARACTER_TYPE_PERSIST_KEY,
  USERNAME_PERSIST_KEY,
} from "../lib/constants/constants";
import { CharacterType } from "../shared/dtos/character";
import { useLocalStorageState } from "./useLocalStorageState";

export const useUsername = () =>
  useLocalStorageState<string>(USERNAME_PERSIST_KEY, sessionStorage);

export const useCharacterType = () =>
  useLocalStorageState<CharacterType>(
    CHARACTER_TYPE_PERSIST_KEY,
    sessionStorage
  );
