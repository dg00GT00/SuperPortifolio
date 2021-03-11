import 'package:logging/logging.dart';
import 'utils/logger_platform.dart';

abstract class BaseLogger {
  String loggerName;

  Logger get logger => Logger(loggerName);

  void log(Level level, String message);
}

class DefaultLogger extends BaseLogger {
  DefaultLogger() {
    _generateLoggerInfo();
  }

  void _generateLoggerInfo() {
    final colorLog = ColorLog();
    Logger.root.level = Level.ALL;
    Logger.root.onRecord.listen((LogRecord record) {
      final colorLevel =
          colorLog.getColoredLog(record.level.name.toUpperCase());
      print('${colorLevel}: ${record.time}: ${record.message}');
    });
  }

  @override
  void log(Level level, String message) {
    logger.log(level, message);
  }
}
