export function buildFeedResponse(pins: any[], totalPins: number, page: number, limit: number) {
  const totalPages = Math.ceil(totalPins / limit);

  return {
    pins,
    page,
    limit,
    totalPins,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
