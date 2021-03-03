import 'dart:io';

import 'package:logging/logging.dart';
import 'package:rxdart/rxdart.dart';
import 'package:sass/sass.dart' as sass;
import 'package:watcher/watcher.dart';

import 'css_writer.dart';
import 'logger.dart';
import 'utils/files_system.dart';

class WatcherBuilder {
  Stream<WatchEvent> sassStream;

  Stream<ProcessSignal> processStream;

  Future<void> buildWatcherStreamsAsync() async {
    final directory = await getDefaultSourceDirectory();
    sassStream = DirectoryWatcher(directory.path).events;
    processStream = ProcessSignal.sigint.watch();
  }
}

class SassWatcher extends WatcherBuilder {
  IOSink _ioSink;
  final BaseLogger logger;

  SassWatcher({this.logger}) {
    logger.loggerName = runtimeType.toString();
  }

  void watch(CssFileSink cssFileSink, String scssFilePath) {
    logger.log(Level.INFO, 'Watching sass compilation...');

    final subs = sassStream.switchMap((WatchEvent event) {
      if (event.type.toString().contains('modify')) {
        final css = sass.compile(scssFilePath);
        cssFileSink
            .writeToFileAsync(css, cssFileSink.buildDefaultCssFilePath())
            .then((value) => _ioSink = value);
      }
      return processStream;
    }).listen((_) {}, onError: (e) {
      logger.log(Level.SEVERE, 'Scss compilation error:\n ${e}');
    });

    subs.onData((ProcessSignal data) {
      logger.log(Level.INFO, 'Closing css file...');
      _ioSink.close();
      logger.log(Level.INFO, 'Shutting down process...');
      subs.cancel();
      logger.log(Level.INFO, 'Done.');
    });
  }
}
