export function buildFeedResponse(
  pins: any[],
  totalPins: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(totalPins / limit);
  const hasNextPage = totalPages === 0 ? false : page < totalPages; 

  return {
    pins,
    page,
    limit,
    totalPins,
    totalPages,
    hasNextPage,
    hasPrevPage: page > 1,
  };
}