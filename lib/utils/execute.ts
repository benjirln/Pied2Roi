import { Logger } from "@/lib/utils/logger";

export function execute(fn: () => Promise<void>, name?: string) {
  const logger = new Logger(name ?? `execute:${fn.name}`);
  fn()
    .catch((error) => {
      logger.error(error);
      process.exit(1);
    })
    .then(() => process.exit(0));
}
