"use client";

import { useEffect, useRef, useState } from "react";
import gqlClient from "@/src/lib/services/graphql";
import { PinType } from "@/src/types/types";

const LIMIT = 20;

export default function useInfinitePins(
  query: any,
  variables: Record<string, any> = {},
  responseKey: string
) {
  const [pins, setPins] = useState<PinType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);
  const fetchingRef = useRef(false);

  async function fetchPins(currentPage: number) {
    if (fetchingRef.current) return;

    fetchingRef.current = true;

    try {
      const res = await gqlClient.request(query, {
        ...variables,
        limit: LIMIT,
        page: currentPage,
      });

      const data = res?.[responseKey];

      setPins((prev) => {
        const merged = [...prev, ...(data?.pins || [])];

        const unique = Array.from(
          new Map(merged.map((pin) => [pin.id, pin])).values()
        );

        return unique;
      });

      setHasNextPage(data?.hasNextPage ?? false);
    } catch (err) {
      console.error(err);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPins(1);
  }, [JSON.stringify(variables)]);

  useEffect(() => {
    if (page === 1) return;
    fetchPins(page);
  }, [page]);

  useEffect(() => {
    if (!observerRef.current) return;

    observerInstance.current?.disconnect();

    observerInstance.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && hasNextPage && !fetchingRef.current) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observerInstance.current.observe(observerRef.current);

    return () => observerInstance.current?.disconnect();
  }, [hasNextPage]);

  return { pins, loading, observerRef };
}