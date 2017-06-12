export enum LogLevel {
   DEBUG   = 1       << 1,
   INFO    = DEBUG   << 1,
   WARNING = INFO    << 1,
   ERROR   = WARNING << 1,
   LOG     = ERROR   << 1,

   NONE    = 0,
   DEFAULT = INFO | WARNING | ERROR,
   ALL     = DEBUG | INFO | WARNING | ERROR | LOG,
   VERBOSE = ALL,
}
