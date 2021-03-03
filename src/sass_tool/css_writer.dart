import 'dart:io';

import 'package:logging/logging.dart';

import 'logger.dart';
import 'utils/files_system.dart';

abstract class CssFileSink {
  String buildDefaultCssFilePath() {
    return createDefaultCssFilePath(Directory.current, 'main.css');
  }

  Future<IOSink> writeToFileAsync(String css, String cssFilePath);
}

class CssWriter extends CssFileSink {
  final BaseLogger logger;

  CssWriter({this.logger}) {
    logger.loggerName = runtimeType.toString();
  }

  @override
  Future<IOSink> writeToFileAsync(String css, String cssFilePath) async {
    final outPut = File(cssFilePath).openWrite();
    outPut.write(css);
    await outPut.flush();
    logger.log(Level.INFO, 'scss transpiled successfully');
    return outPut;
  }
}
