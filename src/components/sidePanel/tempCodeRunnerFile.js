<Grid container spacing={3}>
    <Grid item xs={12}>
        <Paper>xs=12</Paper>
    </Grid>
    <Grid item xs={12} container>
        <Grid item xs container direction='column' spacing={3}>
            <Grid item xs={4}>
                <Paper>xs=4</Paper>
            </Grid>
            <Grid item xs={8}>
                <Paper>
                    <Grid item xs container direction='column' spacing={2}>
                        <Grid item xs={12}>
                            <Paper>
                                <Grid
                                    item
                                    xs
                                    container
                                    direction='row'
                                    spacing={1}
                                >
                                    <Grid item xs={6}>
                                        <Paper>xs=4</Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper>xs=4</Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <Grid
                                    item
                                    xs
                                    container
                                    direction='row'
                                    spacing={1}
                                >
                                    <Grid item xs={6}>
                                        <Paper>xs=4</Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper>xs=4</Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper>
                                <Grid
                                    item
                                    xs
                                    container
                                    direction='row'
                                    spacing={1}
                                >
                                    <Grid item xs={6}>
                                        <Paper>xs=4</Paper>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Paper>xs=4</Paper>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    </Grid>
</Grid>;
