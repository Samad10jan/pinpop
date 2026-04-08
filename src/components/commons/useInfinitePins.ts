"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gqlClient from "@/src/lib/services/graphql";
import { PinType } from "@/src/types/types";

const LIMIT = 20;

export default function useInfinitePins(
  query: any,
  variables: Record<string, any> = {},
  responseKey: string,
  onError?: (error: any) => void
) {
  const [pins, setPins] = useState<PinType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);

  const observerInstance = useRef<IntersectionObserver | null>(null);
  const fetchingRef = useRef(false);
  const pageRef = useRef(1);
  const hasNextPageRef = useRef(true);
  const variablesRef = useRef(variables);
  const queryRef = useRef(query);

  const variablesKey = JSON.stringify(variables);

  async function fetchNextPage() {
    if (fetchingRef.current || !hasNextPageRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const res = await gqlClient.request(queryRef.current, {
        ...variablesRef.current,
        limit: LIMIT,
        page: pageRef.current,
      });

      
      

      const data = res?.[responseKey];
      const incoming: PinType[] = data?.pins ?? [];
      console.log(data);
      const nextPage: boolean = data?.hasNextPage ?? false;

      setPins((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const fresh = incoming.filter((p) => !existingIds.has(p.id));
        return [...prev, ...fresh];
      });

      hasNextPageRef.current = nextPage;
      setHasNextPage(nextPage);

      if (nextPage) pageRef.current += 1;
    } catch (err) {
      console.error(err);
      onError?.(err);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }

  // Reset + fetch on variable change
  useEffect(() => {
    variablesRef.current = variables;
    queryRef.current = query;

    setPins([]);
    setLoading(true);
    setHasNextPage(true);
    pageRef.current = 1;
    hasNextPageRef.current = true;
    fetchingRef.current = false;

    fetchNextPage();
  }, [variablesKey]);

  // Callback ref — called by React the moment the sentinel mounts/unmounts
  // This solves the null ref problem: observer is set up exactly when the
  // DOM node is available, not on a fixed useEffect timing
  const observerRef = useCallback((sentinel: HTMLDivElement | null) => {
    // Clean up previous observer whenever the node changes
    observerInstance.current?.disconnect();
    observerInstance.current = null;

    if (!sentinel) return; // node unmounted, nothing to observe

    observerInstance.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPageRef.current &&
          !fetchingRef.current
        ) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" }
    );

    observerInstance.current.observe(sentinel);
  }, []); 

  return { pins, loading, hasNextPage, observerRef };
}