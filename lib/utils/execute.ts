import { Logger } from "@/lib/utils/logger";

export function execute(fn: () => Promise<void>) {
  const logger = new Logger(`execute:${fn.name}`);
  fn()
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    })
    .then(() => process.exit(0));
}
