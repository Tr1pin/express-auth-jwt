
app.get('/', (req, res) => {
    const { user } = req.session;
    res.render('index', user);
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserRepository.login({ username, password });
        const token = jwt.sign(
            { id: user._id, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000,
        }).send({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    try {
        const id = await UserRepository.create({ username, password });
        res.status(201).send({ message: 'User registered successfully', user : undefined });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

app.post('/logout', (req, res) => {
    res.clearCookie('access_token')
});

app.get('/protected', (req, res) => {
    const { user } = req.session;
    if (!user) return res.status(403).send('Access not authorized');
    res.render('protected', user);
});
