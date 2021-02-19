/**
 * For development/other specialized cases we can hardcode the list of broadcasters and orchestrators with
 * --broadcaster and --orchestrator CLI parameters. This implements those.
 */

export default function hardcodedNodes({
  broadcasters,
  orchestrators,
  ingest,
  prices,
}) {
  try {
    broadcasters = JSON.parse(broadcasters);
    orchestrators = JSON.parse(orchestrators);
    ingest = JSON.parse(ingest);
    prices = JSON.parse(prices);
  } catch (e) {
    console.error(
      "Error parsing LP_BROADCASTERS, LP_ORCHESTRATORS, LP_INGEST and AND LP_PRICES"
    );
    throw e;
  }
  return (req, res, next) => {
    if (!req.getBroadcasters) {
      req.getBroadcasters = async () => broadcasters;
    }
    if (!req.getOrchestrators) {
      req.getOrchestrators = async () => orchestrators;
    }
    if (!req.getIngest) {
      req.getIngest = async () => ingest;
    }
    if (!req.prices) {
      req.getPrices = async () => prices;
    }
    next();
  };
}
