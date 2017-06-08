JS package manage CLI utility.


TODOS:

- [ ] Show packages that have been touched, but not published
- [ ] cupboard config file that points to packages
- [ ] batch execute commands against package dirs
- [ ] JS access

```javascript
import cupboard from 'cupboard';

const cbd = cupboard(require('./cupboard.js'));

cbd.execute('npm list $packageFileName');
```

