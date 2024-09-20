import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { MessageType } from "./message";

export type FetchNextPageType = (
  options?: FetchNextPageOptions
) => Promise<
  InfiniteQueryObserverResult<InfiniteData<MessageType[], unknown>, Error>
>;

export type QueryMessages = InfiniteData<MessageType[], unknown>;
