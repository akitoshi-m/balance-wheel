import React, { ChangeEvent, useRef, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Slider,
  TextField,
  Typography,
  Container,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Snackbar,
  IconButton,
  Alert
} from "@mui/material";
import { AttachMoney, Close, FamilyRestroom, HealthAndSafety, Home, People, School, SportsEsports, Work } from "@mui/icons-material";
import html2canvas from "html2canvas";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const category = {
  Work: 0,
  Money: 1,
  Health: 2,
  Family: 3,
  Relationships: 4,
  Learning: 5,
  Leisure: 6,
  Environment: 7,
} as const;

type CategoryTypes = (typeof category)[keyof typeof category];

const categoryNames = (categoryType: CategoryTypes): string => {
  switch (categoryType) {
    case category.Work:
      return "仕事・キャリア";
    case category.Money:
      return "お金・経済";
    case category.Health:
      return "健康";
    case category.Family:
      return "家族・パートナー";
    case category.Relationships:
      return "人間関係";
    case category.Learning:
      return "学び・自己啓発";
    case category.Leisure:
      return "遊び・余暇";
    case category.Environment:
      return "物理的環境";
  }
};

const categoryIcons = (categoryType: CategoryTypes): JSX.Element => {
  switch (categoryType) {
    case category.Work:
      return <Work />;
    case category.Money:
      return <AttachMoney />;
    case category.Health:
      return <HealthAndSafety />;
    case category.Family:
      return <FamilyRestroom />;
    case category.Relationships:
      return <People />;
    case category.Learning:
      return <School />;
    case category.Leisure:
      return <SportsEsports />;
    case category.Environment:
      return <Home />;
  }
};

const initialValues = [5, 5, 5, 5, 5, 5, 5, 5];

const RadarChart: React.FC = () => {
  const [values, setValues] = useState<number[]>(initialValues);
  const [textFields, setTextFields] = useState<string[]>(Array(initialValues.length).fill(""));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const data = {
    labels: Object.keys(category).map((key) => categoryNames(category[key as keyof typeof category])),
    datasets: [
      {
        label: "満足度",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 10
      }
    }
  };

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;

  const handleSliderChange = (index: number, newValue: number) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  };

  const handleTextFieldChange = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newTextFields = [...textFields];
    newTextFields[index] = event.target.value;
    setTextFields(newTextFields);
  };

  const handleSaveAsImage = () => {
    if (printRef.current) {
      html2canvas(printRef.current, { useCORS: true, logging: true }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${formattedDate}_wheel_of_life.png`;
        link.click();
        setSnackbarOpen(true);
      }).catch((error) => {
        console.error("Error capturing image:", error);
      });
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <Container sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ p: 2, fontWeight: 'bold' }}>
        人生の輪 作成ツール
      </Typography>

      <div ref={printRef} style={{ margin: 2 }}>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h5">
              人生の輪
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6">
              {currentDate.getFullYear()}年{currentDate.getMonth() + 1}月{currentDate.getDate()}日
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '60%' }}>
              <Radar data={data} options={options} />
            </div>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <List>
                  {Object.values(category).slice(0, 4).map((catType, index) => (
                    <ListItem alignItems="flex-start" key={index}>
                      <ListItemAvatar>
                        <Avatar>
                          {categoryIcons(catType)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={categoryNames(catType)}
                        secondary={
                          <Typography
                            sx={{ display: 'inline', lineHeight: 1.0 }}
                            component="span"
                            variant="overline"
                            color="text.primary"
                          >
                            {textFields[catType]}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={6}>
                <List>
                  {Object.values(category).slice(4).map((catType, index) => (
                    <ListItem alignItems="flex-start" key={index}>
                      <ListItemAvatar>
                        <Avatar>
                          {categoryIcons(catType)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={categoryNames(catType)}
                        secondary={
                          <Typography
                          sx={{ display: 'inline', lineHeight: 1.2 }}
                            component="span"
                            variant="overline"
                            color="text.primary"
                          >
                            {textFields[catType]}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <Button variant="contained" sx={{ m: 2 }} onClick={handleSaveAsImage}>
        画像として保存する
      </Button>
      <Divider>
        <Typography variant="overline">
          以下、入力項目
        </Typography>
      </Divider>
      <Grid container spacing={2} alignItems="center">
        {Object.values(category).map((catType, index) => (
          <React.Fragment key={catType}>
            <Grid item xs={2}>
              <Typography variant="body1">
                <label>{categoryNames(catType)}</label>
              </Typography>
            </Grid>
            <Grid item xs={3} container alignItems="center">
              <Slider
                defaultValue={5}
                size="small"
                max={10}
                min={1}
                sx={{ width: '80%' }}
                value={values[catType]}
                onChange={(_e, newValue) => handleSliderChange(catType, newValue as number)}
              />
              <Typography variant="body1" sx={{ ml: 2 }}>
                {values[catType]}
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <TextField
                fullWidth
                id={catType.toString()}
                placeholder={categoryNames(catType)}
                size="small"
                multiline
                value={textFields[catType]}
                onChange={(e) => handleTextFieldChange(catType, e)}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          保存しました！
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default RadarChart;
