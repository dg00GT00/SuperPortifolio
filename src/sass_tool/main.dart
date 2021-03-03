import 'css_writer.dart';
import 'logger.dart';
import 'sass_watcher.dart';

/*
* Transpile SCSS files to CSS
* The command line arguments must be in the following order:
*   - The directory at which the ".scss" file is in
*   - The name of the ".scss" file to watch
*   - The directory in which the ".css" file should be written on
*   - The name of ".css" file to write the transpiled ".scss" file on
*/
Future<void> main(List<String> args) async {
  final logger = DefaultLogger();
  final sassWatcher = SassWatcher(logger: logger);
  await sassWatcher.buildWatcherStreamsAsync();
  sassWatcher.watch(CssWriter(logger: logger), args.first);
}
